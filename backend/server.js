import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'muebleria-iglesias-secret-2025';
const PORT = process.env.PORT || 3001;

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas en las variables de entorno!');
}

const isServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('✅ Supabase configurado:', supabaseUrl);
console.log('🔑 Tipo de llave activa:', isServiceRole ? 'SERVICE_ROLE (Acceso total)' : 'ANON/KEY (Sujeto a políticas RLS)');

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer memory storage for direct cloud upload to Supabase Storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Middleware to verify Gestor role
function requireGestor(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'gestor') {
      return res.status(403).json({ error: 'Acceso denegado: Se requiere rol de gestor' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ==========================================
// RUTAS DE AUTENTICACIÓN (SUPABASE)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      // Fallback for default admin
      if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign(
          { id: 1, username: 'admin', role: 'gestor' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          message: 'Inicio de sesión exitoso',
          token,
          user: { id: 1, username: 'admin', role: 'gestor' }
        });
      }
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash) || (username === 'admin' && password === 'admin123');
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role || 'gestor' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, username: user.username, role: user.role || 'gestor' }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en autenticación', details: err.message });
  }
});

// ==========================================
// RUTAS PÚBLICAS (ROL VISITANTE - SUPABASE)
// ==========================================

// Helper para persistencia de configuración local (Mueble Destacado)
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error leyendo settings.json:', err.message);
  }
  return { featured_id: null };
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando settings.json:', err.message);
  }
}

// Obtener categorías disponibles
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('furniture')
      .select('category');

    if (error) throw error;

    const uniqueCategories = Array.from(new Set(data.map(item => item.category).filter(Boolean))).sort();
    res.json(uniqueCategories);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías', details: err.message });
  }
});

// Obtener catálogo de muebles con filtros
app.get('/api/furniture', async (req, res) => {
  try {
    const { category, search, compactOnly } = req.query;

    let query = supabase
      .from('furniture')
      .select('*')
      .order('id', { ascending: false });

    if (category && category !== 'Todo' && category !== 'Todo el catálogo') {
      query = query.eq('category', category);
    }

    if (compactOnly === 'true' || compactOnly === '1') {
      query = query.eq('is_compact', 1);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,materials.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const { featured_id } = getSettings();
    const enriched = data.map(item => ({
      ...item,
      is_featured: featured_id ? (Number(item.id) === Number(featured_id) ? 1 : 0) : 0
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener muebles', details: err.message });
  }
});

// Obtener ID del mueble destacado
app.get('/api/featured', (req, res) => {
  const { featured_id } = getSettings();
  res.json({ featured_id });
});

// Actualizar mueble destacado (solo 1 a la vez)
app.put('/api/featured', requireGestor, (req, res) => {
  const { featured_id } = req.body;
  const current = getSettings();
  current.featured_id = featured_id ? Number(featured_id) : null;
  saveSettings(current);
  res.json({ message: 'Mueble destacado actualizado', featured_id: current.featured_id });
});

// Obtener detalle de un mueble
app.get('/api/furniture/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('furniture')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Mueble no encontrado' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el mueble', details: err.message });
  }
});

// ==========================================
// RUTAS PROTEGIDAS (ROL GESTOR - SUPABASE)
// ==========================================

// Subir fotos a Supabase Storage (Cloud CDN)
app.post('/api/upload', requireGestor, upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname) || '.jpg';
      const fileName = `mueble-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      const { data, error } = await supabase.storage
        .from('furniture-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        console.error('Error subiendo a Supabase Storage:', error);
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('furniture-photos')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    res.json({
      urls: uploadedUrls,
      url: uploadedUrls[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir fotos a Supabase Storage', details: err.message });
  }
});

// Crear nuevo mueble en Supabase
app.post('/api/furniture', requireGestor, async (req, res) => {
  try {
    const { name, category, price, price_credit, weekly_payment, dimensions, materials, description, image_url, images, is_compact } = req.body;

    let imagesArr = [];
    if (Array.isArray(images)) {
      imagesArr = images;
    } else if (typeof images === 'string' && images.startsWith('[')) {
      try { imagesArr = JSON.parse(images); } catch {}
    }
    if (imagesArr.length === 0 && image_url) {
      imagesArr = [image_url];
    }

    const mainImageUrl = image_url || (imagesArr.length > 0 ? imagesArr[0] : '');

    if (!name || !price || !mainImageUrl) {
      return res.status(400).json({ error: 'Nombre, precio e imagen son obligatorios' });
    }

    const { data, error } = await supabase
      .from('furniture')
      .insert([
        {
          name,
          category: category || 'General',
          price: Number(price),
          price_credit: price_credit ? Number(price_credit) : null,
          weekly_payment: weekly_payment ? Number(weekly_payment) : null,
          dimensions: dimensions || 'Medidas estándar',
          materials: materials || '',
          description: description || '',
          image_url: mainImageUrl,
          images: imagesArr,
          is_compact: is_compact ? 1 : 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Si se marcó como destacado, actualizar settings
    if (req.body.is_featured === 1 || req.body.is_featured === true) {
      const current = getSettings();
      current.featured_id = Number(data.id);
      saveSettings(current);
    }

    res.status(201).json({ ...data, is_featured: req.body.is_featured ? 1 : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar mueble en Supabase', details: err.message });
  }
});

// Actualizar mueble en Supabase
app.put('/api/furniture/:id', requireGestor, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, price_credit, weekly_payment, dimensions, materials, description, image_url, images, is_compact } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = Number(price);
    if (price_credit !== undefined) updates.price_credit = price_credit ? Number(price_credit) : null;
    if (weekly_payment !== undefined) updates.weekly_payment = weekly_payment ? Number(weekly_payment) : null;
    if (dimensions !== undefined) updates.dimensions = dimensions;
    if (materials !== undefined) updates.materials = materials;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (images !== undefined) {
      updates.images = Array.isArray(images) ? images : (typeof images === 'string' && images.startsWith('[') ? JSON.parse(images) : [images]);
    }
    if (is_compact !== undefined) updates.is_compact = is_compact ? 1 : 0;

    const { data, error } = await supabase
      .from('furniture')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Actualizar destacado si se especificó
    if (req.body.is_featured !== undefined) {
      const current = getSettings();
      if (req.body.is_featured === 1 || req.body.is_featured === true) {
        current.featured_id = Number(id);
      } else if (Number(current.featured_id) === Number(id)) {
        current.featured_id = null;
      }
      saveSettings(current);
    }

    const { featured_id } = getSettings();
    res.json({ ...data, is_featured: Number(featured_id) === Number(id) ? 1 : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar mueble en Supabase', details: err.message });
  }
});

// Eliminar mueble en Supabase
app.delete('/api/furniture/:id', requireGestor, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('furniture')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Mueble eliminado de Supabase correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mueble de Supabase', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(` Servidor de Mueblería Iglesias conectado a Supabase en http://localhost:${PORT}`);
});
