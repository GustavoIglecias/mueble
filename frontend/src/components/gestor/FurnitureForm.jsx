import React from 'react';
import { CATEGORIES, MATERIALS } from '../../constants/catalog';

// ─── FurnitureForm ────────────────────────────────────────────────────────────
// Formulario de ficha descriptiva de un mueble: nombre, categoría,
// precios, dimensiones, materiales, descripción y toggles de insignias.
//
// Props:
//   formData / setFormData → estado principal del formulario
//   dims / setDims         → { alto, ancho, fondo }
//   selectedMaterials / toggleMaterial → materiales seleccionados

export default function FurnitureForm({
  formData,
  setFormData,
  dims,
  setDims,
  selectedMaterials,
  toggleMaterial,
}) {
  const set = (field) => (e) => setFormData(d => ({ ...d, [field]: e.target.value }));
  const setCheck = (field) => (e) => setFormData(d => ({ ...d, [field]: e.target.checked }));

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede7e3] flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#9f3c16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="font-serif-custom text-[17px] font-semibold text-[#1d1b19]">Ficha Descriptiva</h2>
      </div>

      {/* ── Nombre ── */}
      <Field label="Nombre de la pieza *">
        <div className="flex items-center gap-2 bg-[#f9f2ef] rounded-xl px-3.5 py-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors">
          <svg className="w-4 h-4 text-[#8a726a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <input
            type="text"
            value={formData.name}
            onChange={set('name')}
            placeholder="ej. Sillón Curvo Terracota"
            className="bg-transparent text-[15px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none w-full"
          />
        </div>
      </Field>

      {/* ── Categoría ── */}
      <Field label="Categoría">
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
      </Field>

      {/* ── Precios ── */}
      <Field label="Precios">
        <div className="flex flex-col gap-3">
          <PriceInput label="Contado *" value={formData.price} onChange={set('price')} placeholder="4950" />
          <PriceInput label="A crédito (opcional)" value={formData.price_credit} onChange={set('price_credit')} placeholder="5200" />

          {formData.price_credit && (
            <>
              <PriceInput label="Pago semanal (opcional)" value={formData.weekly_payment} onChange={set('weekly_payment')} placeholder="200" suffix="/ sem" />
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
            </>
          )}
        </div>
      </Field>

      {/* ── Dimensiones ── */}
      <Field label="Dimensiones Exactas" hint="en centímetros">
        <div className="grid grid-cols-3 gap-2.5">
          {[{ key: 'alto', label: 'Alto' }, { key: 'ancho', label: 'Ancho' }, { key: 'fondo', label: 'Fondo' }].map(({ key, label }) => (
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
      </Field>

      {/* ── Materiales ── */}
      <Field label="Composición de Materiales">
        <div className="flex flex-wrap gap-1.5">
          {MATERIALS.map(mat => {
            const sel = selectedMaterials.includes(mat);
            return (
              <button
                key={mat}
                type="button"
                onClick={() => toggleMaterial(mat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  sel ? 'bg-[#1d1b19] text-white' : 'bg-[#f3ede9] text-[#57423b] hover:bg-[#ede7e3]'
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
      </Field>

      {/* ── Descripción ── */}
      <Field label="Descripción de la pieza">
        <textarea
          rows={3}
          value={formData.description}
          onChange={set('description')}
          placeholder="Por qué queda bien en espacios compactos, detalles de fabricación, confort..."
          className="bg-[#f9f2ef] rounded-xl px-3.5 py-3 text-[14px] text-[#1d1b19] placeholder:text-[#cdc5bc] border border-[#dec0b7] focus:border-[#9f3c16] focus:outline-none resize-none transition-colors leading-relaxed w-full"
        />
      </Field>

      {/* ── Toggle: Pieza Destacada ── */}
      <label className="flex items-start gap-3 bg-[#fff8f4] p-3.5 rounded-xl cursor-pointer border-2 border-[#9f3c16]/30 hover:border-[#9f3c16] transition-colors select-none shadow-2xs">
        <input
          type="checkbox"
          checked={formData.is_featured}
          onChange={setCheck('is_featured')}
          className="mt-0.5 w-4 h-4 rounded accent-[#9f3c16] border-[#dec0b7] focus:ring-0 shrink-0"
        />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-[#9f3c16]">⭐ Pieza Destacada de Portada (Hero)</span>
            <span className="text-[10px] px-2 rounded-full bg-[#ffdbcf] text-[#832600] font-semibold">Solo 1 en todo el catálogo</span>
          </div>
          <span className="text-[12px] text-[#57423b] leading-relaxed">
            Esta pieza ocupará el banner principal arriba de la página. Reemplaza automáticamente a cualquier otra anterior.
          </span>
        </div>
      </label>

      {/* ── Toggle: Casas Compactas ── */}
      <label className="flex items-start gap-3 bg-[#f9f2ef] p-3.5 rounded-xl cursor-pointer border border-[#dec0b7] select-none">
        <input
          type="checkbox"
          checked={formData.is_compact}
          onChange={setCheck('is_compact')}
          className="mt-0.5 w-4 h-4 rounded accent-[#9f3c16] border-[#dec0b7] focus:ring-0 shrink-0"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-[#1d1b19]">Insignia: "Ideal para espacios compactos"</span>
          <span className="text-[12px] text-[#8a726a] leading-relaxed">
            Para casas o departamentos pequeños (aparece con etiqueta "Compacto" y se puede filtrar).
          </span>
        </div>
      </label>
    </section>
  );
}

// ── Componentes auxiliares internos ──────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-[#8a726a] uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[11px] text-[#8a726a]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function PriceInput({ label, value, onChange, placeholder, suffix = 'MXN' }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-[#8a726a] font-medium">{label}</span>
      <div className="flex items-center gap-2 bg-[#f9f2ef] rounded-xl px-3.5 py-3 border border-[#dec0b7] focus-within:border-[#9f3c16] transition-colors">
        <span className="font-serif-custom text-[20px] text-[#9f3c16] font-semibold leading-none">$</span>
        <input
          type="number"
          min="0"
          step="50"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent font-serif-custom text-[22px] text-[#1d1b19] placeholder:text-[#cdc5bc] outline-none w-full"
        />
        <span className="text-[11px] text-[#8a726a] bg-[#ede7e3] px-2 py-1 rounded-lg font-semibold shrink-0">
          {suffix}
        </span>
      </div>
    </div>
  );
}
