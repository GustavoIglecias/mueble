import { useState, useEffect, useMemo } from 'react';
import { fetchFurniture, fetchCategories, deleteFurniture } from '../api';

// ─── useCatalog ──────────────────────────────────────────────────────────────
// Encapsula todo el estado y la lógica de datos del catálogo:
// fetching, filtros en memoria, ordenamiento y eliminación de muebles.
//
// Uso:
//   const catalog = useCatalog();
//   catalog.filteredFurniture  → array filtrado listo para renderizar
//   catalog.loadData()         → recarga desde el servidor

export function useCatalog() {
  const [allFurniture, setAllFurniture] = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Filtros
  const [search, setSearch]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [compactOnly, setCompactOnly]           = useState(false);
  const [sortBy, setSortBy]                     = useState('destacado');

  // Estado del modal de eliminación
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);

  // ── Carga de datos ──────────────────────────────────────────────────────
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [muebles, cats] = await Promise.all([
        fetchFurniture(),
        fetchCategories(),
      ]);
      setAllFurniture(muebles);
      setCategories(cats);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el catálogo. Asegúrate de que el servidor esté encendido.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  // ── Filtrado y ordenamiento en memoria (0ms lag, sin recarga de página) ──
  const filteredFurniture = useMemo(() => {
    let list = [...allFurniture];

    // Filtro de categoría
    if (selectedCategory && selectedCategory !== 'Todo' && selectedCategory !== 'Todo el catálogo') {
      list = list.filter(item => item.category === selectedCategory);
    }

    // Filtro de casas compactas
    if (compactOnly) {
      list = list.filter(item => item.is_compact === 1 || item.is_compact === true);
    }

    // Búsqueda de texto
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.materials?.toLowerCase().includes(q)
      );
    }

    // Ordenamiento
    switch (sortBy) {
      case 'precio_asc':
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'precio_desc':
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'nombre':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'));
        break;
      default: // 'destacado' — destacados primero, luego por ID descendente
        list.sort((a, b) => {
          const fa = a.is_featured === 1 || a.is_featured === true ? 1 : 0;
          const fb = b.is_featured === 1 || b.is_featured === true ? 1 : 0;
          if (fb !== fa) return fb - fa;
          return Number(b.id) - Number(a.id);
        });
        break;
    }

    return list;
  }, [allFurniture, selectedCategory, compactOnly, search, sortBy]);

  // ── Eliminación de mueble ───────────────────────────────────────────────
  const requestDelete = (id) => {
    const target = allFurniture.find(x => x.id === id);
    if (target) setItemToDelete(target);
  };

  const confirmDelete = async (id, token) => {
    setIsDeleting(true);
    try {
      await deleteFurniture(id, token);
      setAllFurniture(prev => prev.filter(item => item.id !== id));
      setItemToDelete(null);
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => setItemToDelete(null);

  return {
    // Datos
    allFurniture,
    filteredFurniture,
    categories,
    // Estado de carga
    loading,
    error,
    loadData,
    // Filtros
    search, setSearch,
    selectedCategory, setSelectedCategory,
    compactOnly, setCompactOnly,
    sortBy, setSortBy,
    // Eliminación
    itemToDelete,
    isDeleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
    // Mutación local (para actualizar sin refetch completo)
    setAllFurniture,
  };
}
