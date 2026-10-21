import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../constants/catalog';

// ─── CatalogHero ─────────────────────────────────────────────────────────────
// Cabecera del catálogo: título editorial, buscador, pills de categoría y
// selector de ordenamiento.

export default function CatalogHero({
  categories,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  compactOnly,
  setCompactOnly,
  sortBy,
  setSortBy,
  totalResults,
}) {
  const allCategories = ['Todo el catálogo', ...categories.filter(c => c !== 'Todo' && c !== 'Todo el catálogo')];

  return (
    <>
      {/* ── Título editorial ──────────────────────────────────────────────── */}
      <section className="px-5 pt-4 pb-4 flex flex-col gap-2.5">
        <div className="inline-flex items-center gap-2 self-start bg-[#f3ede9] px-3 py-1.5 rounded-full border border-[#dec0b7]/70">
          <span className="w-2 h-2 rounded-full bg-[#9f3c16] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#635e56] tracking-wide uppercase">
            Taller activo • Entregas en tu zona residencial
          </span>
        </div>

        <h1 className="font-serif-custom text-3xl md:text-4xl text-[#1d1b19] tracking-tight font-normal leading-tight">
          Mobiliario con calma &amp; materia noble
        </h1>
        <p className="text-sm text-[#635e56] leading-relaxed">
          Piezas de ebanistería contemporánea creadas para resistir el tiempo y adaptarse a las proporciones
          de casas residenciales. Sin intermediarios comerciales.
        </p>
      </section>

      {/* ── Buscador + filtros + ordenamiento ────────────────────────────── */}
      <section className="px-5 pb-5 flex flex-col gap-3">
        {/* Buscador */}
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#635e56]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pieza, material o medidas..."
            className="w-full bg-[#f9f2ef] pl-10 pr-9 py-3 rounded-lg text-[#1d1b19] text-xs md:text-sm placeholder:text-[#635e56] focus:outline-none focus:bg-[#f3ede9] border border-transparent focus:border-[#9f3c16] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Pills de categoría */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pt-0.5 pb-1">
          {allCategories.map((cat) => {
            const isActive =
              selectedCategory === cat ||
              (cat === 'Todo el catálogo' && (selectedCategory === 'Todo' || selectedCategory === 'Todo el catálogo'));
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Todo el catálogo' ? 'Todo' : cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all shadow-2xs ${
                  isActive
                    ? 'bg-[#1d1b19] text-[#fff8f4]'
                    : 'bg-[#f3ede9] text-[#635e56] hover:text-[#1d1b19]'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* Casas Compactas */}
          <button
            onClick={() => setCompactOnly(!compactOnly)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${
              compactOnly
                ? 'bg-[#9f3c16] text-white border-[#9f3c16]'
                : 'bg-[#f3ede9] text-[#635e56] border-[#dec0b7] hover:text-[#1d1b19]'
            }`}
          >
            Casas Compactas
          </button>
        </div>

        {/* Fila: conteo + ordenamiento */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#635e56] uppercase tracking-widest font-semibold">
              Catálogo Permanente • {totalResults} {totalResults === 1 ? 'pieza' : 'piezas'}
            </span>
            <h2 className="font-serif-custom text-2xl text-[#1d1b19] font-medium">
              Piezas Seleccionadas
            </h2>
          </div>

          {setSortBy && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#f3ede9] px-2.5 py-1.5 rounded-lg border border-[#dec0b7]/70 shadow-2xs">
              <ArrowUpDown size={13} className="text-[#9f3c16]" />
              <span className="text-[10px] uppercase tracking-wider text-[#635e56] font-semibold">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#1d1b19] focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
