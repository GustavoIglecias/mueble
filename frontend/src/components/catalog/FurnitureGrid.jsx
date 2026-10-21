import React from 'react';
import FurnitureCard from './FurnitureCard';

// ─── FurnitureGrid ────────────────────────────────────────────────────────────
// Grid responsivo 2/3 columnas con las tarjetas de muebles.
// Muestra un estado vacío con botón de reset cuando no hay resultados.

export default function FurnitureGrid({
  furniture,
  isGestor,
  search,
  selectedCategory,
  compactOnly,
  onSelectFurniture,
  onShowQR,
  onEdit,
  onDelete,
  onResetFilters,
}) {
  if (furniture.length === 0) {
    return (
      <div className="py-12 text-center bg-[#f9f2ef] rounded-xl p-6 border border-[#ede7e3] flex flex-col items-center gap-2">
        <p className="text-xs text-[#635e56]">No se encontraron piezas con ese criterio.</p>
        {(search || (selectedCategory !== 'Todo' && selectedCategory !== 'Todo el catálogo') || compactOnly) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#9f3c16] hover:bg-[#832600] text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            Restablecer filtros y ver todo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
      {furniture.map((item) => (
        <FurnitureCard
          key={item.id}
          item={item}
          isGestor={isGestor}
          onSelect={onSelectFurniture}
          onShowQR={onShowQR}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
