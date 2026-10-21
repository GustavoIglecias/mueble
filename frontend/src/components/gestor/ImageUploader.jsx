import React, { useRef } from 'react';

// ─── ImageUploader ────────────────────────────────────────────────────────────
// Sección de carga y previsualización de fotografías del mueble.
// Permite subir hasta 8 imágenes, ver portada y eliminar individualmente.
//
// Props:
//   existingImages     → URLs ya guardadas en Supabase
//   newFilePreviews    → Blob URLs de archivos nuevos seleccionados
//   onAddFiles         → (FileList) → void
//   onRemoveExisting   → (index) → void
//   onRemoveNew        → (index) → void

const MAX_PHOTOS = 8;

export default function ImageUploader({
  existingImages,
  newFilePreviews,
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
}) {
  const fileInputRef = useRef(null);
  const totalPhotos  = existingImages.length + newFilePreviews.length;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length) onAddFiles(selected);
    e.target.value = '';
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede7e3]">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-serif-custom text-[17px] font-semibold text-[#1d1b19]">
          Fotografías del Taller
        </h2>
        <span className="text-[11px] text-[#8a726a] font-medium">{totalPhotos} de {MAX_PHOTOS}</span>
      </div>
      <p className="text-[12px] text-[#8a726a] mb-3 leading-relaxed">
        Sube hasta {MAX_PHOTOS} tomas. La primera será la foto de portada en el catálogo.
      </p>

      {/* Tira horizontal de fotos */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>

        {/* Fotos existentes */}
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
              <RemoveButton onClick={() => onRemoveExisting(idx)} />
            </div>
          </div>
        ))}

        {/* Fotos nuevas */}
        {newFilePreviews.map((url, idx) => (
          <div key={`nw-${idx}`} className="relative shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-[#ede7e3] shadow-sm border-2 border-dashed border-[#9f3c16]">
            <img src={url} alt="Nueva" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              Nueva
            </span>
            <RemoveButton className="absolute bottom-1.5 right-1.5" onClick={() => onRemoveNew(idx)} />
          </div>
        ))}

        {/* Botón agregar */}
        {totalPhotos < MAX_PHOTOS && (
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
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </section>
  );
}

// ── Botón de eliminar foto ──────────────────────────────────────────────────
function RemoveButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors ${className}`}
    >
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
