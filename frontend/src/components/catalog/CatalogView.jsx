import React from 'react';
import CatalogHero from './CatalogHero';
import FeaturedCard from './FeaturedCard';
import FurnitureGrid from './FurnitureGrid';
import TrustBanner from './TrustBanner';

// ─── CatalogView ──────────────────────────────────────────────────────────────
// Orquestador de la vista del catálogo. Compone los sub-componentes
// en el orden correcto y pasa las props necesarias a cada uno.

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
  onDelete,
}) {
  // La pieza destacada es la marcada por el gestor, o la primera por defecto
  const featuredPiece =
    furniture.find(item => item.is_featured === 1 || item.is_featured === true) || furniture[0];

  // La tarjeta hero solo se muestra sin filtros activos
  const showFeatured =
    featuredPiece &&
    !search &&
    (selectedCategory === 'Todo' || selectedCategory === 'Todo el catálogo') &&
    !compactOnly;

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('Todo');
    setCompactOnly(false);
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-4xl mx-auto pb-8">

      {/* 1. Buscador, título y filtros */}
      <CatalogHero
        categories={categories}
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        compactOnly={compactOnly}
        setCompactOnly={setCompactOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={furniture.length}
      />

      {/* 2. Tarjeta hero de pieza destacada */}
      {showFeatured && (
        <FeaturedCard
          item={featuredPiece}
          isGestor={isGestor}
          onSelect={onSelectFurniture}
          onEdit={onEdit}
        />
      )}

      {/* 3. Grid del catálogo */}
      <section className="px-5 pb-8 flex flex-col gap-4">
        <FurnitureGrid
          furniture={furniture}
          isGestor={isGestor}
          search={search}
          selectedCategory={selectedCategory}
          compactOnly={compactOnly}
          onSelectFurniture={onSelectFurniture}
          onShowQR={onShowQR}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetFilters={resetFilters}
        />
      </section>

      {/* 4. Banner de confianza */}
      <TrustBanner onGoAtelier={onGoAtelier} />
    </div>
  );
}
