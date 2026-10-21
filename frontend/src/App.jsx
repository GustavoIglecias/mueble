import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// ── Hooks ──────────────────────────────────────────────────────────────────
import { useCatalog }     from './hooks/useCatalog';
import { useGestorAuth }  from './hooks/useGestorAuth';

// ── Layout ─────────────────────────────────────────────────────────────────
import Header    from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// ── Vistas principales ──────────────────────────────────────────────────────
import CatalogView from './components/catalog/CatalogView';
import AtelierView from './components/atelier/AtelierView';
import ContactView from './components/contact/ContactView';

// ── Modales compartidos ─────────────────────────────────────────────────────
import SplashScreen         from './components/shared/SplashScreen';
import QRCodeModal          from './components/shared/QRCodeModal';

// ── Modales de producto ─────────────────────────────────────────────────────
import ProductDetailModal   from './components/product/ProductDetailModal';

// ── Modales del gestor ──────────────────────────────────────────────────────
import GestorLoginModal     from './components/gestor/GestorLoginModal';
import GestorFurnitureModal from './components/gestor/GestorFurnitureModal';
import DeleteConfirmModal   from './components/gestor/DeleteConfirmModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab]   = useState('catalogo');

  // ── Estado del catálogo (fetching, filtros, eliminación) ────────────────
  const catalog = useCatalog();

  // ── Autenticación del gestor ────────────────────────────────────────────
  const auth = useGestorAuth();

  // ── Estado de modales de producto ──────────────────────────────────────
  const [selectedItem, setSelectedItem]           = useState(null);
  const [qrItem, setQrItem]                       = useState(null);
  const [isFurnitureModalOpen, setIsFurnitureModalOpen] = useState(false);
  const [editingItem, setEditingItem]             = useState(null);

  // ── Navegación por URL: ?mueble=ID ─────────────────────────────────────
  useEffect(() => {
    if (catalog.allFurniture.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const mId = params.get('mueble') || params.get('pieza');
      if (mId) {
        const found = catalog.allFurniture.find(x => String(x.id) === String(mId));
        if (found) { setSelectedItem(found); setActiveTab('catalogo'); }
      }
    }
  }, [catalog.allFurniture]);

  useEffect(() => {
    if (selectedItem) {
      window.history.replaceState({ muebleId: selectedItem.id }, '', `${window.location.pathname}?mueble=${selectedItem.id}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.has('mueble') || params.has('pieza')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    const handle = () => {
      const params = new URLSearchParams(window.location.search);
      const mId = params.get('mueble') || params.get('pieza');
      if (mId && catalog.allFurniture.length > 0) {
        setSelectedItem(catalog.allFurniture.find(x => String(x.id) === String(mId)) || null);
      } else {
        setSelectedItem(null);
      }
    };
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
  }, [catalog.allFurniture]);

  // ── Handlers del gestor ─────────────────────────────────────────────────
  const handleOpenEdit = (item) => { setEditingItem(item); setIsFurnitureModalOpen(true); };
  const handleOpenNew  = ()     => { setEditingItem(null); setIsFurnitureModalOpen(true); };
  const handleCloseModal = ()   => { setIsFurnitureModalOpen(false); setEditingItem(null); };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[#fff8f4] text-[#1d1b19] font-sans antialiased"
      style={{
        paddingTop:    'calc(env(safe-area-inset-top, 0px) + 64px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 74px)',
      }}
    >
      {/* 1. Splash screen de entrada */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. Barra superior */}
      <Header
        gestorUser={auth.gestorUser}
        onOpenLogin={auth.openLogin}
        onLogout={auth.logout}
        onOpenNewFurniture={handleOpenNew}
      />

      {/* 3. Contenido principal por tab */}
      <main className="animate-fade-in">
        {activeTab === 'catalogo' && (
          catalog.loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="animate-spin mb-3 text-[#9f3c16]" size={28} />
              <p className="text-xs">Cargando colección...</p>
            </div>
          ) : catalog.error ? (
            <div className="py-16 text-center bg-[#f9f2ef] rounded-xl p-6 border border-red-200 max-w-md mx-auto mt-6">
              <p className="text-xs text-red-600 mb-3">{catalog.error}</p>
              <button
                onClick={catalog.loadData}
                className="bg-[#1d1b19] text-white text-xs px-4 py-2 rounded-lg font-medium"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <CatalogView
              furniture={catalog.filteredFurniture}
              categories={catalog.categories}
              search={catalog.search}
              setSearch={catalog.setSearch}
              selectedCategory={catalog.selectedCategory}
              setSelectedCategory={catalog.setSelectedCategory}
              compactOnly={catalog.compactOnly}
              setCompactOnly={catalog.setCompactOnly}
              sortBy={catalog.sortBy}
              setSortBy={catalog.setSortBy}
              onSelectFurniture={setSelectedItem}
              onShowQR={setQrItem}
              onGoAtelier={() => setActiveTab('atelier')}
              isGestor={auth.isGestor}
              onEdit={handleOpenEdit}
              onDelete={catalog.requestDelete}
            />
          )
        )}

        {activeTab === 'atelier'  && <AtelierView />}
        {activeTab === 'contacto' && <ContactView />}
      </main>

      {/* 4. Navegación inferior */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 5. Modal de ficha técnica del mueble */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onShowQR={setQrItem}
        />
      )}

      {/* 6. Modal de código QR */}
      {qrItem && <QRCodeModal item={qrItem} onClose={() => setQrItem(null)} />}

      {/* 7. Modal de login del gestor */}
      <GestorLoginModal
        isOpen={auth.isLoginOpen}
        onClose={auth.closeLogin}
        onLoginSuccess={(user, token) => auth.login({ user, token })}
      />

      {/* 8. Modal de crear/editar mueble */}
      <GestorFurnitureModal
        isOpen={isFurnitureModalOpen}
        onClose={handleCloseModal}
        editingItem={editingItem}
        token={auth.token}
        onSaved={() => catalog.loadData(false)}
        categories={catalog.categories}
      />

      {/* 9. Modal de confirmación de borrado */}
      <DeleteConfirmModal
        isOpen={!!catalog.itemToDelete}
        item={catalog.itemToDelete}
        onConfirm={(id) => catalog.confirmDelete(id, auth.token)}
        onCancel={catalog.cancelDelete}
        loading={catalog.isDeleting}
      />
    </div>
  );
}
