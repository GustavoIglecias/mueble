import React from 'react';
import { UserCheck, Shield, Plus, LogOut, SlidersHorizontal } from 'lucide-react';

export default function Header({ gestorUser, onOpenLogin, onLogout, onOpenNewFurniture }) {
  return (
    <header 
      className="fixed top-0 inset-x-0 w-full z-40 bg-[#fff8f4]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(29,27,25,0.03)] border-b border-[#ede7e3]"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      <div className="h-16 px-5 max-w-md md:max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Name */}
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-1.5 leading-none">
            <span className="font-serif-custom text-xl font-bold tracking-tight text-[#1d1b19]">
              Mueblería
            </span>
            <span className="font-serif-custom text-xl italic font-normal text-[#9f3c16]">
              Iglesias
            </span>
          </div>
          <span className="text-[10px] text-[#706a62] tracking-widest uppercase font-semibold mt-1">
            Taller &amp; Mobiliario Artesanal
          </span>
        </div>

        {/* Gestor Access */}
        <div className="flex items-center space-x-2">
          {gestorUser ? (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={onOpenNewFurniture}
                className="flex items-center space-x-1 text-xs font-semibold bg-[#9f3c16] text-white px-3 py-1.5 rounded-lg hover:bg-[#832600] transition-colors shadow-xs"
              >
                <Plus size={14} />
                <span>Nuevo</span>
              </button>
              <div className="flex items-center space-x-1 text-xs text-[#1d1b19] bg-[#ede7e3] px-2.5 py-1.5 rounded-lg font-medium">
                <Shield size={12} className="text-[#9f3c16]" />
                <span>{gestorUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 text-xs font-medium text-[#1d1b19] px-3 py-1.5 rounded-lg border border-[#dec0b7] bg-white hover:bg-[#f3ede9] transition-all shadow-2xs"
            >
              <SlidersHorizontal size={14} className="text-[#9f3c16]" />
              <span>Acceso Gestor</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
