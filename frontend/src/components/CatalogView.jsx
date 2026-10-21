import React from 'react';
import { Search, X, ArrowRight, ShieldCheck, Hammer, Trees, UserCheck, BookOpen, QrCode, Edit3, Trash2, ArrowUpDown } from 'lucide-react';

export default function CatalogView({
  furniture,
  categories,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  compactOnly,
  setCompactOnly,
  sortBy = 'destacado',
  setSortBy,
  onSelectFurniture,
  onShowQR,
  onGoAtelier,
  isGestor,
  onEdit,
  onDelete
}) {
  const allCategories = ['Todo el catálogo', ...categories.filter(c => c !== 'Todo' && c !== 'Todo el catálogo')];
  // Selecciona la pieza destacada única marcada por el gestor, o la primera por defecto
  const featuredPiece = furniture.find(item => item.is_featured === 1 || item.is_featured === true) || furniture[0];

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-4xl mx-auto pb-8">
      {/* 1. Hero Editorial de Bienvenida (from Stitch cat_logo_casa_lento) */}
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
          Piezas de ebanistería contemporánea creadas para resistir el tiempo y adaptarse a las proporciones de casas residenciales. Sin intermediarios comerciales.
        </p>
      </section>

      {/* 2. Buscador y Filtros Rápidos (from Stitch cat_logo_casa_lento) */}
      <section className="px-5 pb-5 flex flex-col gap-3">
        {/* Minimalist Search Input */}
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

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pt-0.5 pb-1">
          {allCategories.map((cat) => {
            const isActive = selectedCategory === cat || (cat === 'Todo el catálogo' && (selectedCategory === 'Todo' || selectedCategory === 'Todo el catálogo'));
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
          
          {/* Casas chicas pill */}
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
      </section>

      {/* 3. Destacado del Atelier / Lookbook Hero Card (from Stitch cat_logo_casa_lento) */}
      {featuredPiece && !search && selectedCategory === 'Todo' && !compactOnly && (
        <section className="px-5 pb-7">
          <div className="bg-[#f9f2ef] rounded-xl overflow-hidden p-3.5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(29,27,25,0.04)] border border-[#ede7e3]">
            {/* Image Frame with Badge */}
            <div 
              className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-[#f3ede9] cursor-pointer group"
              onClick={() => onSelectFurniture(featuredPiece)}
            >
              <img
                src={featuredPiece.image_url}
                alt={featuredPiece.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-3 left-3 bg-[#fff8f4]/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xs border border-[#dec0b7]/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9f3c16] animate-pulse" />
                <span className="text-[10px] text-[#9f3c16] uppercase tracking-wider font-semibold">
                  ⭐ Edición Destacada
                </span>
              </div>
              {isGestor && (
                <div 
                  className="absolute top-3 right-3 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(featuredPiece)}
                    title="Editar pieza destacada"
                    className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-blue-600 text-[11px] font-semibold shadow-sm hover:bg-white flex items-center gap-1 transition-colors"
                  >
                    <Edit3 size={12} />
                    <span>Editar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Info & Spec Block */}
            <div className="flex flex-col gap-2 px-1 pt-1">
              <h2 className="font-serif-custom text-xl md:text-2xl text-[#1d1b19] font-medium leading-snug">
                {featuredPiece.name}
              </h2>
              <p className="text-xs text-[#635e56] leading-relaxed">
                {featuredPiece.materials || featuredPiece.description}
              </p>

              {/* Bloque de Precios Hero — 3 columnas uniformes */}
              <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden border border-[#dec0b7] bg-[#dec0b7]">
                {/* Contado */}
                <div className="flex flex-col bg-[#f3ede9] px-2.5 py-2.5">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-[#8a726a] mb-0.5">Contado</span>
                  <span className="font-price text-base font-bold text-[#1d1b19] leading-tight">
                    ${Number(featuredPiece.price).toLocaleString('es-MX')}
                  </span>
                  <span className="text-[9px] text-[#706a62]">MXN</span>
                </div>
                {/* A Crédito */}
                <div className="flex flex-col bg-[#f3ede9] px-2.5 py-2.5 items-center text-center border-x border-[#dec0b7]">
                  <span className="text-[9px] uppercase tracking-wider font-semibold mb-0.5"
                    style={{ color: featuredPiece.price_credit ? '#9f3c16' : '#b0a9a4' }}>
                    A Crédito
                  </span>
                  {featuredPiece.price_credit ? (
                    <>
                      <span className="font-price text-base font-bold text-[#9f3c16] leading-tight">
                        ${Number(featuredPiece.price_credit).toLocaleString('es-MX')}
                      </span>
                      <span className="text-[9px] text-[#706a62]">MXN total</span>
                    </>
                  ) : (
                    <span className="text-sm text-[#b0a9a4] font-medium mt-0.5">—</span>
                  )}
                </div>
                {/* Pago Semanal */}
                <div className="flex flex-col bg-[#f3ede9] px-2.5 py-2.5 items-end text-right">
                  <span className="text-[9px] uppercase tracking-wider font-semibold mb-0.5"
                    style={{ color: featuredPiece.weekly_payment && Number(featuredPiece.weekly_payment) > 0 ? '#9f3c16' : '#b0a9a4' }}>
                    Semanal
                  </span>
                  {featuredPiece.weekly_payment && Number(featuredPiece.weekly_payment) > 0 ? (
                    <>
                      <span className="font-price text-base font-bold text-[#9f3c16] leading-tight">
                        ${Number(featuredPiece.weekly_payment).toLocaleString('es-MX')}
                      </span>
                      <span className="text-[9px] text-[#706a62]">
                        {featuredPiece.price_credit
                          ? `${Math.ceil(Number(featuredPiece.price_credit) / Number(featuredPiece.weekly_payment))} sem.`
                          : '/sem'}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-[#b0a9a4] font-medium mt-0.5">—</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#635e56]">
                <span className="font-medium text-[#1d1b19]">Dim: {featuredPiece.dimensions}</span>
                <span className="w-1 h-1 rounded-full bg-[#dec0b7]" />
                <span>Trato directo</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectFurniture(featuredPiece)}
                className="mt-3 w-full bg-[#9f3c16] hover:bg-[#832600] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors shadow-xs group"
              >
                <span>Ver ficha de pieza</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Cuadrícula / Feed Editorial del Catálogo Completo (from Stitch cat_logo_casa_lento) */}
      <section className="px-5 pb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#635e56] uppercase tracking-widest font-semibold">
              Catálogo Permanente • {furniture.length} {furniture.length === 1 ? 'pieza' : 'piezas'}
            </span>
            <h2 className="font-serif-custom text-2xl text-[#1d1b19] font-medium">
              Piezas Seleccionadas
            </h2>
          </div>

          {/* Selector de Ordenamiento */}
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
                <option value="destacado">⭐ Recomendados</option>
                <option value="precio_asc">💲 Menor precio</option>
                <option value="precio_desc">💎 Mayor precio</option>
                <option value="nombre">🔤 Nombre (A - Z)</option>
              </select>
            </div>
          )}
        </div>

        {furniture.length === 0 ? (
          <div className="py-12 text-center bg-[#f9f2ef] rounded-xl p-6 border border-[#ede7e3] flex flex-col items-center gap-2">
            <p className="text-xs text-[#635e56]">No se encontraron piezas con ese criterio.</p>
            {(search || (selectedCategory !== 'Todo' && selectedCategory !== 'Todo el catálogo') || compactOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('Todo');
                  setCompactOnly(false);
                }}
                className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#9f3c16] hover:bg-[#832600] text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                Restablecer filtros y ver todo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {furniture.map((item) => (
              <article
                key={item.id}
                className="bg-[#f9f2ef] rounded-xl overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(29,27,25,0.04)] border border-[#ede7e3] cursor-pointer group"
                onClick={() => onSelectFurniture(item)}
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-[#f3ede9]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Gestor controls — top right overlay */}
                  {isGestor && (
                    <div
                      className="absolute top-2 right-2 flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEdit(item)}
                        title="Editar"
                        className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-blue-600 shadow-sm hover:bg-white transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        title="Eliminar"
                        className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-red-500 shadow-sm hover:bg-white transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                  {/* QR button — bottom left */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onShowQR(item); }}
                    title="Ver QR"
                    className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#635e56] shadow-sm hover:bg-white transition-colors"
                  >
                    <QrCode size={13} />
                  </button>
                  {/* Crédito badge — bottom right */}
                  {item.price_credit && (
                    <div className="absolute bottom-2 right-2 bg-[#9f3c16]/90 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      <span className="text-[9px] text-white font-semibold uppercase tracking-wide">Crédito</span>
                    </div>
                  )}
                  {/* Badges top left */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {item.is_featured === 1 && (
                      <div className="bg-[#9f3c16] text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider">⭐ Destacada</span>
                      </div>
                    )}
                    {item.is_compact === 1 && (
                      <div className="bg-[#f3ede9]/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#dec0b7]/60">
                        <span className="text-[9px] text-[#57423b] font-semibold">Compacto</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col gap-1.5 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-[#8a726a] font-semibold">
                    {item.category}
                  </span>
                  <h3 className="font-serif-custom text-sm font-medium text-[#1d1b19] leading-snug line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Price section */}
                  <div className="mt-auto pt-2.5 border-t border-[#ede7e3] flex flex-col gap-1.5">
                    {/* Fila Contado */}
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#8a726a] font-semibold shrink-0">
                        Contado
                      </span>
                      <span className="font-price text-sm font-bold text-[#1d1b19] leading-tight text-right">
                        ${Number(item.price).toLocaleString('es-MX')}
                        <span className="text-[9px] font-normal text-[#706a62] ml-0.5">MXN</span>
                      </span>
                    </div>

                    {/* Fila Crédito */}
                    {item.price_credit ? (
                      <div className="flex items-baseline justify-between gap-1 pt-1.5 border-t border-[#ede7e3]/60">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-[#9f3c16] font-semibold">
                            A Crédito
                          </span>
                          {item.weekly_payment && Number(item.weekly_payment) > 0 && (
                            <span className="text-[10px] text-[#706a62] font-medium leading-tight">
                              ${Number(item.weekly_payment).toLocaleString('es-MX')}/sem · {Math.ceil(Number(item.price_credit) / Number(item.weekly_payment))} sem.
                            </span>
                          )}
                        </div>
                        <span className="font-price text-xs font-bold text-[#9f3c16] leading-tight text-right shrink-0">
                          ${Number(item.price_credit).toLocaleString('es-MX')}
                          <span className="text-[8px] font-normal text-[#706a62] ml-0.5">MXN</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1.5 border-t border-[#ede7e3]/60">
                        <span className="text-[9px] uppercase tracking-wider text-[#b0a9a4] font-semibold">
                          A Crédito
                        </span>
                        <span className="text-[10px] text-[#b0a9a4]">
                          Solo contado
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. Banner de Confianza & Filosofía Artesanal (from Stitch cat_logo_casa_lento) */}
      <section className="px-5 pb-6">
        <div className="bg-[#f3ede9] rounded-xl p-5 flex flex-col gap-4 shadow-[0_2px_12px_rgba(29,27,25,0.02)] border border-[#ede7e3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffdbcf] flex items-center justify-center text-[#9f3c16] shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-serif-custom text-base text-[#1d1b19] font-medium">
                Compromiso Mueblería Iglesias
              </h4>
              <p className="text-[10px] text-[#635e56] uppercase tracking-wider font-semibold">
                Filosofía de taller local &amp; Oficio
              </p>
            </div>
          </div>

          {/* Trust Pillars */}
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <Hammer size={17} className="text-[#9f3c16] shrink-0 mt-0.5" />
              <p className="text-xs text-[#1d1b19] leading-relaxed">
                <strong className="font-semibold">Garantía estructural</strong> en todas las uniones de madera maciza y herrería.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <Trees size={17} className="text-[#9f3c16] shrink-0 mt-0.5" />
              <p className="text-xs text-[#1d1b19] leading-relaxed">
                <strong className="font-semibold">Madera noble seleccionada</strong> secada y trabajada para evitar torceduras o grietas.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck size={17} className="text-[#9f3c16] shrink-0 mt-0.5" />
              <p className="text-xs text-[#1d1b19] leading-relaxed">
                <strong className="font-semibold">Trato directo con la Familia Iglesias</strong> para resolver dudas o adaptar medidas a tu casa.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoAtelier}
              className="w-full bg-[#fff8f4] hover:bg-[#ede7e3] text-[#1d1b19] py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors shadow-xs border border-[#dec0b7]/50"
            >
              <span>Conoce la historia del taller</span>
              <BookOpen size={15} className="text-[#9f3c16]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
