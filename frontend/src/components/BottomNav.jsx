import React from 'react';
import { Armchair, Hammer, Mail } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav 
      className="fixed bottom-0 inset-x-0 w-full z-40 bg-[#fff8f4]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(29,27,25,0.03)] border-t border-[#ede7e3]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="h-16 px-6 max-w-md md:max-w-4xl mx-auto flex items-center justify-around">
        {/* Tab 1: Catálogo */}
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
            activeTab === 'catalogo'
              ? 'text-[#9f3c16] font-semibold'
              : 'text-[#635e56] hover:text-[#1d1b19]'
          }`}
        >
          <Armchair size={22} strokeWidth={activeTab === 'catalogo' ? 2.4 : 1.8} />
          <span className="text-[11px] tracking-wide mt-1">Catálogo</span>
        </button>

        {/* Tab 2: El Taller (Historia & Oficio) */}
        <button
          onClick={() => setActiveTab('atelier')}
          className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
            activeTab === 'atelier'
              ? 'text-[#9f3c16] font-semibold'
              : 'text-[#635e56] hover:text-[#1d1b19]'
          }`}
        >
          <Hammer size={22} strokeWidth={activeTab === 'atelier' ? 2.4 : 1.8} />
          <span className="text-[11px] tracking-wide mt-1">El Taller</span>
        </button>

        {/* Tab 3: Contacto (Venta en áreas públicas & WhatsApp) */}
        <button
          onClick={() => setActiveTab('contacto')}
          className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
            activeTab === 'contacto'
              ? 'text-[#9f3c16] font-semibold'
              : 'text-[#635e56] hover:text-[#1d1b19]'
          }`}
        >
          <Mail size={22} strokeWidth={activeTab === 'contacto' ? 2.4 : 1.8} />
          <span className="text-[11px] tracking-wide mt-1">Contacto</span>
        </button>
      </div>
    </nav>
  );
}
