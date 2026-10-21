import React, { useState, useEffect, useRef } from 'react';
import { createFurniture, updateFurniture, uploadImages } from '../api';

// ─── Helper: parse legacy dimension string → {alto, ancho, fondo} ──────────
function parseDimensions(str) {
  if (!str) return { alto: '', ancho: '', fondo: '' };
  // Try "90 cm (Ancho) × 25 cm (Prof.) × 85 cm (Alto)" style
  const parts = str.split(/[×x]/);
  if (parts.length === 3) {
    const nums = parts.map(p => p.match(/\d+(\.\d+)?/)?.[0] || '');
    // Detect if order contains labels
    const labels = parts.map(p => p.toLowerCase());
    let alto = '', ancho = '', fondo = '';
    labels.forEach((l, i) => {
      if (l.includes('alto') || l.includes('alt')) alto = nums[i];
      else if (l.includes('ancho') || l.includes('anch')) ancho = nums[i];
      else if (l.includes('prof') || l.includes('fond') || l.includes('prof')) fondo = nums[i];
    });
    // If no labels found, assume order: Ancho × Fondo × Alto
    if (!alto && !ancho && !fondo) {
      return { ancho: nums[0] || '', fondo: nums[1] || '', alto: nums[2] || '' };
    }
    return { alto, ancho, fondo };
  }
  // Single number fallback
  const single = str.match(/\d+/)?.[0] || '';
  return { alto: single, ancho: '', fondo: '' };
}

// ─── Helper: format {alto, ancho, fondo} → dimension string ─────────────────
function formatDimensions({ alto, ancho, fondo }) {
  const parts = [];
  if (ancho) parts.push(`${ancho} cm (Ancho)`);
  if (fondo) parts.push(`${fondo} cm (Prof.)`);
  if (alto) parts.push(`${alto} cm (Alto)`);
  return parts.join(' × ');
}

const CATEGORIES = ['Sillones', 'Sofás', 'Mesas', 'Recibidores', 'Iluminación', 'Recámaras', 'Comedores', 'Decoración'];
const MATERIALS = ['Roble macizo', 'Nogal', 'Parota', 'Travertino', 'Bouclé', 'Lino lavado', 'Herrería', 'MDF enchapado'];

export default function GestorFurnitureModal({
  isOpen,
  onClose,
  editingItem,
  token,
  onSaved,
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sillones',
    price: '',
    price_credit: '',
    weekly_payment: '',
    description: '',
    is_compact: true,
    is_featured: false,
  });
  const [dims, setDims] = useState({ alto: '', ancho: '', fondo: '' });
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // Images
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);

  // ── Populate form when editing ──────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      const parsed = parseDimensions(editingItem.dimensions || '');
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category || 'Sillones',
        price: editingItem.price || '',
        price_credit: editingItem.price_credit || '',
        weekly_payment: editingItem.weekly_payment || '',
        description: editingItem.description || '',
        is_compact: editingItem.is_compact !== undefined ? !!editingItem.is_compact : true,
        is_featured: editingItem.is_featured === 1 || editingItem.is_featured === true,
      });
      setDims(parsed);

      // Parse materials from string → selected array
      const matStr = editingItem.materials || '';
      const matched = MATERIALS.filter(m => matStr.toLowerCase().includes(m.toLowerCase()));
      setSelectedMaterials(matched);

      let imgs = [];
      if (editingItem.images) {
        try { imgs = typeof editingItem.images === 'string' ? JSON.parse(editingItem.images) : editingItem.images; } catch { imgs = []; }
      }
      if (!Array.isArray(imgs) || imgs.length === 0) imgs = editingItem.image_url ? [editingItem.image_url] : [];
      setExistingImages(imgs);
      setNewFiles([]);
      setNewFilePreviews([]);
    } else {
      setFormData({ name: '', category: 'Sillones', price: '', price_credit: '', weekly_payment: '', description: '', is_compact: true, is_featured: false });
      setDims({ alto: '', ancho: '', fondo: '' });
      setSelectedMaterials([]);
      setExistingImages([]);
      setNewFiles([]);
      setNewFilePreviews([]);
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // ── File selection ──────────────────────────────────────────────────────
  const handleFilesSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    setNewFiles(prev => [...prev, ...selected]);
    setNewFilePreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const handleRemoveExisting = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNew = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setNewFilePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Material toggle ─────────────────────────────────────────────────────
  const toggleMaterial = (mat) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!formData.name.trim()) { setError('El nombre de la pieza es obligatorio.'); return; }
    if (!formData.price) { setError('El precio es obligatorio.'); return; }
    if (existingImages.length + newFiles.length === 0) { setError('Debes subir al menos una fotografía.'); return; }

    setLoading(true);
    try {
      let finalImages = [...existingImages];
      if (newFiles.length > 0) {
        const result = await uploadImages(newFiles, token);
        finalImages = [...finalImages, ...(result.urls || [result.url])];
      }

      const materialsStr = selectedMaterials.join(', ');
      const dimensionsStr = formatDimensions(dims);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        price_credit: formData.price_credit ? Number(formData.price_credit) : null,
        weekly_payment: formData.weekly_payment ? Number(formData.weekly_payment) : null,
        dimensions: dimensionsStr,
        materials: materialsStr,
        description: formData.description,
        is_compact: formData.is_compact ? 1 : 0,
        is_featured: formData.is_featured ? 1 : 0,
        image_url: finalImages[0],
        images: finalImages,
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

  const totalPhotos = existingImages.length + newFiles.length;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: '#fff8f4',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* ── HEADER ───────────────────────────────────────────────────── */}
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
          <p className="text-[10px] text-[#8a726a] uppercase tracking-widest font-semibold">Atelier · Registro</p>
          <p className="text-[13px] font-semibold text-[#1d1b19] leading-tight">
            {editingItem ? 'Editar Ficha' : 'Nueva Pieza'}
          </p>
        </div>
        {/* Spacer to balance header */}
        <div className="w-[64px]" />
      </header>

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="px-5 py-5 flex flex-col gap-5 max-w-lg mx-auto">

          {/* ── ERROR BANNER ─────────────────────────────────────────── */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 1 · FOTOGRAFÍAS                                    */}
          {/* ══════════════════════════════════════════════════════════ */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede7e3]">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-serif-custom text-[17px] font-semibold text-[#1d1b19]">Fotografías del Taller</h2>
              <span className="text-[11px] text-[#8a726a] font-medium">{totalPhotos} de 8</span>
            </div>
            <p className="text-[12px] text-[#8a726a] mb-3 leading-relaxed">
              Sube hasta 8 tomas. La primera será la foto de portada en el catálogo.
            </p>

            {/* Horizontal scroll track */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
              {/* Existing images */}
              {existingImages.map((url, idx) => (
                <div key={`ex-${idx}`} className="relative shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-[#ede7e3] shadow-sm">
                  <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[#9f3c16] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Portada
                    </span>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="text-white text-[10px] font-semibold">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(idx)}
                      className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* New file previews */}
              {newFilePreviews.map((url, idx) => (
                <div key={`nw-${idx}`} className="relative shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-[#ede7e3] shadow-sm border-2 border-dashed border-[#9f3c16]">
                  <img src={url} alt="Nueva" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    Nueva
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(idx)}
                    className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add photo dropzone */}
              {totalPhotos < 8 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-24 h-32 rounded-xl bg-[#f9f2ef] border-2 border-dashed border-[#dec0b7] hover:border-[#9f3c16] hover:bg-[#fff8f4] transition-colors flex flex-col items-center justify-center gap-2 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-full bg-[#9f3c16] flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-[#57423b] text-center leading-tight px-1">
                    Añadir Toma
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelect}
                className="hidden"
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 2 · FICHA DESCRIPTIVA                              */}
          {/* ══════════════════════════════════════════════════════════ */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede7e3] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#9f3c16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="font-serif-custom text-[17px] font-semibold text-[#1d1b19]">Ficha Descriptiva</h2>
            </div>

            {/* ── Nombre ── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">
                Nombre de la pieza *
              </label>
              <div className="flex items-center gap-2 bg-[#f9f2ef] rounded-xl px-3.5 py-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors">
                <svg className="w-4 h-4 text-[#8a726a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                  placeholder="ej. Sillón Curvo Terracota"
                  className="bg-transparent text-[15px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none w-full"
                />
              </div>
            </div>

            {/* ── Categoría chips ── */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">
                Categoría
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData(d => ({ ...d, category: cat }))}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                      formData.category === cat
                        ? 'bg-[#1d1b19] text-white shadow-sm'
                        : 'bg-[#f3ede9] text-[#57423b] hover:bg-[#ede7e3]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Precios ── */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">
                Precios
              </label>

              {/* Precio Contado */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#8a726a] font-medium">Contado *</span>
                <div className="flex items-center gap-2 bg-[#f9f2ef] rounded-xl px-3.5 py-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors">
                  <span className="font-serif-custom text-[20px] text-[#9f3c16] font-semibold leading-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.price}
                    onChange={e => setFormData(d => ({ ...d, price: e.target.value }))}
                    placeholder="4950"
                    className="bg-transparent font-serif-custom text-[22px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none w-full"
                  />
                  <span className="text-[11px] text-[#8a726a] bg-[#ede7e3] px-2 py-1 rounded-lg font-semibold shrink-0">
                    MXN
                  </span>
                </div>
              </div>

              {/* Precio Crédito */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#8a726a] font-medium">A crédito <span className="text-[#cdc5bc] font-normal">(opcional)</span></span>
                <div className="flex items-center gap-2 bg-[#f9f2ef] rounded-xl px-3.5 py-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors">
                  <span className="font-serif-custom text-[20px] text-[#9f3c16] font-semibold leading-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.price_credit}
                    onChange={e => setFormData(d => ({ ...d, price_credit: e.target.value }))}
                    placeholder="5200"
                    className="bg-transparent font-serif-custom text-[22px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none w-full"
                  />
                  <span className="text-[11px] text-[#8a726a] bg-[#ede7e3] px-2 py-1 rounded-lg font-semibold shrink-0">
                    MXN
                  </span>
                </div>
              </div>

              {/* Pago semanal — solo visible si hay precio crédito */}
              {formData.price_credit && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#8a726a] font-medium">Pago semanal <span className="text-[#cdc5bc] font-normal">(opcional)</span></span>
                  <div className="flex items-center gap-2 bg-[#f9f2ef] rounded-xl px-3.5 py-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors">
                    <span className="font-serif-custom text-[20px] text-[#9f3c16] font-semibold leading-none">$</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={formData.weekly_payment}
                      onChange={e => setFormData(d => ({ ...d, weekly_payment: e.target.value }))}
                      placeholder="200"
                      className="bg-transparent font-serif-custom text-[22px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none w-full"
                    />
                    <span className="text-[11px] text-[#8a726a] bg-[#ede7e3] px-2 py-1 rounded-lg font-semibold shrink-0">
                      / sem
                    </span>
                  </div>

                  {/* Vista previa del cálculo en tiempo real */}
                  {formData.weekly_payment && Number(formData.weekly_payment) > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#eae1d7] rounded-lg border border-[#dec0b7]">
                      <svg className="w-3.5 h-3.5 text-[#9f3c16] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[12px] text-[#57423b] font-medium">
                        ${Number(formData.weekly_payment).toLocaleString('es-MX')} × {Math.ceil(Number(formData.price_credit) / Number(formData.weekly_payment))} semanas
                        {' '}= ${Number(formData.price_credit).toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* ── Dimensiones 3 columnas ── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">
                  Dimensiones Exactas
                </label>
                <span className="text-[11px] text-[#8a726a]">en centímetros</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'alto', label: 'Alto' },
                  { key: 'ancho', label: 'Ancho' },
                  { key: 'fondo', label: 'Fondo' },
                ].map(({ key, label }) => (
                  <div key={key} className="bg-[#f9f2ef] rounded-xl p-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors flex flex-col gap-1">
                    <span className="text-[10px] text-[#8a726a] font-semibold uppercase tracking-wide">{label}</span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        min="0"
                        value={dims[key]}
                        onChange={e => setDims(d => ({ ...d, [key]: e.target.value }))}
                        placeholder="—"
                        className="w-full bg-transparent font-serif-custom text-[20px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none"
                      />
                      <span className="text-[11px] text-[#8a726a] shrink-0">cm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Materiales chips ── */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">
                Composición de Materiales
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MATERIALS.map(mat => {
                  const sel = selectedMaterials.includes(mat);
                  return (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => toggleMaterial(mat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        sel
                          ? 'bg-[#1d1b19] text-white'
                          : 'bg-[#f3ede9] text-[#57423b] hover:bg-[#ede7e3]'
                      }`}
                    >
                      <span>{mat}</span>
                      {sel && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Descripción ── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">
                Descripción de la pieza
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                placeholder="Por qué queda bien en espacios compactos, detalles de fabricación, confort..."
                className="bg-[#f9f2ef] rounded-xl px-3.5 py-3 text-[14px] text-[#1d1b19] placeholder:text-[#cdc5bc] border border-[#dec0b7] focus:border-[#9f3c16] focus:outline-none resize-none transition-colors leading-relaxed"
              />
            </div>

            {/* ── Pieza Destacada de Portada (Exclusiva - Solo 1 a la vez) ── */}
            <label className="flex items-start gap-3 bg-[#fff8f4] p-3.5 rounded-xl cursor-pointer border-2 border-[#9f3c16]/30 hover:border-[#9f3c16] transition-colors select-none shadow-2xs">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={e => setFormData(d => ({ ...d, is_featured: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded accent-[#9f3c16] border-[#dec0b7] focus:ring-0 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#9f3c16]">
                    ⭐ Pieza Destacada de Portada (Hero)
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#ffdbcf] text-[#832600] font-semibold">
                    Solo 1 en todo el catálogo
                  </span>
                </div>
                <span className="text-[12px] text-[#57423b] leading-relaxed">
                  Esta pieza ocupará el banner principal en grande arriba de la página. Al marcarla, reemplazará automáticamente a cualquier otra pieza destacada anterior.
                </span>
              </div>
            </label>

            {/* ── Espacio compacto toggle ── */}
            <label className="flex items-start gap-3 bg-[#f9f2ef] p-3.5 rounded-xl cursor-pointer border border-[#dec0b7] select-none">
              <input
                type="checkbox"
                checked={formData.is_compact}
                onChange={e => setFormData(d => ({ ...d, is_compact: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded accent-[#9f3c16] border-[#dec0b7] focus:ring-0 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-[#1d1b19]">
                  Insignia: "Ideal para espacios compactos"
                </span>
                <span className="text-[12px] text-[#8a726a] leading-relaxed">
                  Para casas o departamentos pequeños (aparece con etiqueta "Compacto" y se puede filtrar con el botón superior).
                </span>
              </div>
            </label>
          </section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 3 · ACCIONES                                       */}
          {/* ══════════════════════════════════════════════════════════ */}
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

      {/* ── TOAST NOTIFICATION ───────────────────────────────────────── */}
      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1d1b19] text-white px-4 py-2.5 rounded-full shadow-xl text-[13px] font-medium flex items-center gap-2 pointer-events-none whitespace-nowrap transition-all duration-300 z-50 ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <svg className="w-4 h-4 text-[#9f3c16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {toast}
      </div>
    </div>
  );
}
