import React, { useState, useEffect } from 'react';
import { createFurniture, updateFurniture, uploadImages } from '../../api';
import { CATEGORIES, MATERIALS } from '../../constants/catalog';
import ImageUploader from './ImageUploader';
import FurnitureForm from './FurnitureForm';
import Toast from '../ui/Toast';

// ─── Helpers de dimensiones ──────────────────────────────────────────────────

function parseDimensions(str) {
  if (!str) return { alto: '', ancho: '', fondo: '' };
  const parts = str.split(/[×x]/);
  if (parts.length === 3) {
    const nums = parts.map(p => p.match(/\d+(\.\d+)?/)?.[0] || '');
    const labels = parts.map(p => p.toLowerCase());
    let alto = '', ancho = '', fondo = '';
    labels.forEach((l, i) => {
      if      (l.includes('alto') || l.includes('alt'))              alto  = nums[i];
      else if (l.includes('ancho') || l.includes('anch'))             ancho = nums[i];
      else if (l.includes('prof') || l.includes('fond'))              fondo = nums[i];
    });
    if (!alto && !ancho && !fondo) {
      return { ancho: nums[0] || '', fondo: nums[1] || '', alto: nums[2] || '' };
    }
    return { alto, ancho, fondo };
  }
  const single = str.match(/\d+/)?.[0] || '';
  return { alto: single, ancho: '', fondo: '' };
}

function formatDimensions({ alto, ancho, fondo }) {
  const parts = [];
  if (ancho) parts.push(`${ancho} cm (Ancho)`);
  if (fondo) parts.push(`${fondo} cm (Prof.)`);
  if (alto)  parts.push(`${alto} cm (Alto)`);
  return parts.join(' × ');
}

// ─── GestorFurnitureModal ─────────────────────────────────────────────────────
// Modal de pantalla completa para crear o editar un mueble del catálogo.
// Orquesta ImageUploader, FurnitureForm y el envío al servidor.

const EMPTY_FORM = {
  name: '', category: CATEGORIES[0], price: '', price_credit: '',
  weekly_payment: '', description: '', is_compact: true, is_featured: false,
};

export default function GestorFurnitureModal({ isOpen, onClose, editingItem, token, onSaved }) {
  const [formData, setFormData]             = useState(EMPTY_FORM);
  const [dims, setDims]                     = useState({ alto: '', ancho: '', fondo: '' });
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles]             = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [toast, setToast]                   = useState('');

  // ── Poblar formulario al abrir ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      const parsed = parseDimensions(editingItem.dimensions || '');
      setFormData({
        name:         editingItem.name || '',
        category:     editingItem.category || CATEGORIES[0],
        price:        editingItem.price || '',
        price_credit: editingItem.price_credit || '',
        weekly_payment: editingItem.weekly_payment || '',
        description:  editingItem.description || '',
        is_compact:   editingItem.is_compact !== undefined ? !!editingItem.is_compact : true,
        is_featured:  editingItem.is_featured === 1 || editingItem.is_featured === true,
      });
      setDims(parsed);

      const matStr = editingItem.materials || '';
      const matched = MATERIALS.filter(m => matStr.toLowerCase().includes(m.toLowerCase()));
      setSelectedMaterials(matched);

      let imgs = [];
      if (editingItem.images) {
        try { imgs = typeof editingItem.images === 'string' ? JSON.parse(editingItem.images) : editingItem.images; }
        catch { imgs = []; }
      }
      if (!Array.isArray(imgs) || imgs.length === 0) imgs = editingItem.image_url ? [editingItem.image_url] : [];
      setExistingImages(imgs);
    } else {
      setFormData(EMPTY_FORM);
      setDims({ alto: '', ancho: '', fondo: '' });
      setSelectedMaterials([]);
      setExistingImages([]);
    }

    setNewFiles([]);
    setNewFilePreviews([]);
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // ── Handlers de imágenes ──────────────────────────────────────────────
  const handleAddFiles = (files) => {
    setNewFiles(prev => [...prev, ...files]);
    setNewFilePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  const handleRemoveExisting = (idx) => setExistingImages(prev => prev.filter((_, i) => i !== idx));
  const handleRemoveNew      = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setNewFilePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Toggle de materiales ──────────────────────────────────────────────
  const toggleMaterial = (mat) =>
    setSelectedMaterials(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!formData.name.trim()) { setError('El nombre de la pieza es obligatorio.'); return; }
    if (!formData.price)       { setError('El precio es obligatorio.'); return; }
    if (existingImages.length + newFiles.length === 0) {
      setError('Debes subir al menos una fotografía.');
      return;
    }

    setLoading(true);
    try {
      let finalImages = [...existingImages];
      if (newFiles.length > 0) {
        const result = await uploadImages(newFiles, token);
        finalImages = [...finalImages, ...(result.urls || [result.url])];
      }

      const payload = {
        name:          formData.name.trim(),
        category:      formData.category,
        price:         Number(formData.price),
        price_credit:  formData.price_credit  ? Number(formData.price_credit)  : null,
        weekly_payment: formData.weekly_payment ? Number(formData.weekly_payment) : null,
        dimensions:    formatDimensions(dims),
        materials:     selectedMaterials.join(', '),
        description:   formData.description,
        is_compact:    formData.is_compact  ? 1 : 0,
        is_featured:   formData.is_featured ? 1 : 0,
        image_url:     finalImages[0],
        images:        finalImages,
      };

      if (editingItem) {
        await updateFurniture(editingItem.id, payload, token);
      } else {
        await createFurniture(payload, token);
      }

      onSaved();
      triggerToast(editingItem ? 'Cambios guardados correctamente ✓' : 'Mueble publicado en catálogo ✓');
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message || 'Error al procesar el mueble.');
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: '#fff8f4',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 h-14 px-5 flex items-center justify-between bg-[#fff8f4]/90 backdrop-blur-xl border-b border-[#ede7e3] z-10">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[#57423b] hover:text-[#1d1b19] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Volver</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] text-[#8a726a] uppercase tracking-widest font-semibold">El Taller · Registro</p>
          <p className="text-[13px] font-semibold text-[#1d1b19] leading-tight">
            {editingItem ? 'Editar Ficha' : 'Nueva Pieza'}
          </p>
        </div>
        <div className="w-[64px]" />
      </header>

      {/* ── Cuerpo desplazable ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="px-5 py-5 flex flex-col gap-5 max-w-lg mx-auto">

          {/* Error */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Sección 1: Fotografías */}
          <ImageUploader
            existingImages={existingImages}
            newFilePreviews={newFilePreviews}
            onAddFiles={handleAddFiles}
            onRemoveExisting={handleRemoveExisting}
            onRemoveNew={handleRemoveNew}
          />

          {/* Sección 2: Ficha descriptiva */}
          <FurnitureForm
            formData={formData}
            setFormData={setFormData}
            dims={dims}
            setDims={setDims}
            selectedMaterials={selectedMaterials}
            toggleMaterial={toggleMaterial}
          />

          {/* Sección 3: Acciones */}
          <section className="flex flex-col gap-2.5 pb-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#9f3c16] hover:bg-[#832600] disabled:opacity-60 text-white font-semibold text-[14px] py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  <span>{editingItem ? 'Guardar Cambios' : 'Publicar en Catálogo'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-[13px] font-medium text-[#8a726a] hover:text-[#1d1b19] transition-colors"
            >
              Cancelar
            </button>
          </section>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
