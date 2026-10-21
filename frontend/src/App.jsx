import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import CatalogView from './components/CatalogView';
import AtelierView from './components/AtelierView';
import ContactView from './components/ContactView';
import ProductDetailModal from './components/ProductDetailModal';
import QRCodeModal from './components/QRCodeModal';
import GestorLoginModal from './components/GestorLoginModal';
import GestorFurnitureModal from './components/GestorFurnitureModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import BottomNav from './components/BottomNav';
import { fetchFurniture, fetchCategories, deleteFurniture } from './api';
import { RefreshCw } from 'lucide-react';

export default function App() {
  // Splash Screen State (2.2s intro)
  const [showSplash, setShowSplash] = useState(true);

  const [allFurniture, setAllFurniture] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Sorting for Catalog
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [compactOnly, setCompactOnly] = useState(false);
  const [sortBy, setSortBy] = useState('destacado'); // 'destacado' | 'precio_asc' | 'precio_desc' | 'nombre'

  // Active view tab: 'catalogo' | 'atelier' | 'contacto'
  const [activeTab, setActiveTab] = useState('catalogo');

  // Gestor Auth state
  const [gestorUser, setGestorUser] = useState(() => {
    try {
      const saved = localStorage.getItem('muebleria_iglesias_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('muebleria_iglesias_token') || '');

  // Modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFurnitureModalOpen, setIsFurnitureModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete Confirm Modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Catalog Data (fetches once or when database mutates)
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [muebles, cats] = await Promise.all([
        fetchFurniture(),
        fetchCategories()
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

  // Handle direct product URL from query params: ?mueble=4 or ?pieza=4
  useEffect(() => {
    if (allFurniture.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const mId = params.get('mueble') || params.get('pieza');
      if (mId) {
        const found = allFurniture.find(x => String(x.id) === String(mId));
        if (found) {
          setSelectedItem(found);
          setActiveTab('catalogo');
        }
      }
    }
  }, [allFurniture]);

  // Sync URL when selectedItem changes (without reloading page)
  useEffect(() => {
    if (selectedItem) {
      const newUrl = `${window.location.pathname}?mueble=${selectedItem.id}`;
      window.history.replaceState({ muebleId: selectedItem.id }, '', newUrl);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.has('mueble') || params.has('pieza')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [selectedItem]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const mId = params.get('mueble') || params.get('pieza');
      if (mId && allFurniture.length > 0) {
        const found = allFurniture.find(x => String(x.id) === String(mId));
        setSelectedItem(found || null);
      } else {
        setSelectedItem(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allFurniture]);

  // Filter and sort catalog in real-time in memory (0ms lag, no page flicker)
  const filteredFurniture = useMemo(() => {
    let list = [...allFurniture];

    // Category filter
    if (selectedCategory && selectedCategory !== 'Todo' && selectedCategory !== 'Todo el catálogo') {
      list = list.filter(item => item.category === selectedCategory);
    }

    // Compact homes filter
    if (compactOnly) {
      list = list.filter(item => item.is_compact === 1);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(item =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.materials && item.materials.toLowerCase().includes(q)) ||
        (item.dimensions && item.dimensions.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'precio_asc') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'precio_desc') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'nombre') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      // 'destacado': is_featured items first, then newer items
      list.sort((a, b) => {
        const aFeat = a.is_featured === 1 ? 1 : 0;
        const bFeat = b.is_featured === 1 ? 1 : 0;
        if (bFeat !== aFeat) return bFeat - aFeat;
        return Number(b.id) - Number(a.id);
      });
    }

    return list;
  }, [allFurniture, selectedCategory, compactOnly, search, sortBy]);

  const handleLoginSuccess = (user, jwtToken) => {
    setGestorUser(user);
    setToken(jwtToken);
    localStorage.setItem('muebleria_iglesias_user', JSON.stringify(user));
    localStorage.setItem('muebleria_iglesias_token', jwtToken);
  };

  const handleLogout = () => {
    setGestorUser(null);
    setToken('');
    localStorage.removeItem('muebleria_iglesias_user');
    localStorage.removeItem('muebleria_iglesias_token');
  };

  const handleConfirmDelete = async (id) => {
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

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFurnitureModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setIsFurnitureModalOpen(true);
  };

  return (
    <div 
      className="min-h-screen bg-[#fff8f4] text-[#1d1b19] font-sans antialiased"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 74px)'
      }}
    >
      {/* 1. ANIMATED INTRO / SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. HEADER */}
      <Header
        gestorUser={gestorUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenNewFurniture={handleOpenNew}
      />

      {/* 3. MAIN CONTENT TABS (STRICTLY FROM STITCH) */}
      <main className="animate-fade-in">
        {/* TAB 1: CATÁLOGO */}
        {activeTab === 'catalogo' && (
          loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="animate-spin mb-3 text-[#9f3c16]" size={28} />
              <p className="text-xs">Cargando colección...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center bg-[#f9f2ef] rounded-xl p-6 border border-red-200 max-w-md mx-auto mt-6">
              <p className="text-xs text-red-600 mb-3">{error}</p>
              <button
                onClick={loadData}
                className="bg-[#1d1b19] text-white text-xs px-4 py-2 rounded-lg font-medium"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <CatalogView
              furniture={filteredFurniture}
              categories={categories}
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              compactOnly={compactOnly}
              setCompactOnly={setCompactOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSelectFurniture={setSelectedItem}
              onShowQR={setQrItem}
              onGoAtelier={() => setActiveTab('atelier')}
              isGestor={!!gestorUser}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                const target = allFurniture.find(x => x.id === id);
                if (target) setItemToDelete(target);
              }}
            />
          )
        )}

        {/* TAB 2: ATELIER (TALLER & HISTORIA) */}
        {activeTab === 'atelier' && (
          <AtelierView />
        )}

        {/* TAB 3: CONTACTO (VENTA EN ÁREAS PÚBLICAS & WHATSAPP) */}
        {activeTab === 'contacto' && (
          <ContactView />
        )}
      </main>

      {/* 4. BOTTOM NAVIGATION (Catálogo, Atelier, Contacto) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 5. PRODUCT DETAIL MODAL (FICHA TÉCNICA) */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onShowQR={setQrItem}
        />
      )}

      {/* 6. QR CODE MODAL */}
      {qrItem && (
        <QRCodeModal
          item={qrItem}
          onClose={() => setQrItem(null)}
        />
      )}

      {/* 7. GESTOR LOGIN MODAL */}
      <GestorLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 8. GESTOR FURNITURE CREATE/EDIT MODAL */}
      <GestorFurnitureModal
        isOpen={isFurnitureModalOpen}
        onClose={() => {
          setIsFurnitureModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        token={token}
        onSaved={() => loadData(false)}
        categories={categories}
      />

      {/* 9. GESTOR DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        item={itemToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
        loading={isDeleting}
      />
    </div>
  );
}
