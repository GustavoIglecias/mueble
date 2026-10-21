import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  item,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onCancel}
    >
      <div 
        className="w-full max-w-sm bg-[#fff8f4] rounded-2xl shadow-2xl border border-[#dec0b7] overflow-hidden flex flex-col p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono y botón cerrar */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-full bg-[#ffdbcf] text-[#9f3c16] flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Título y advertencia */}
        <h3 className="font-serif-custom text-lg font-bold text-[#1d1b19] leading-snug">
          ¿Eliminar esta pieza del catálogo?
        </h3>
        <p className="text-xs text-[#635e56] mt-1.5 leading-relaxed">
          Esta acción quitará el mueble de la vista de todos los clientes de forma permanente.
        </p>

        {/* Tarjeta resumen del mueble a eliminar */}
        <div className="flex items-center gap-3 p-3 bg-[#f3ede9] rounded-xl border border-[#ede7e3] my-4">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-[#dec0b7]/50"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#8a726a] font-semibold truncate">
              {item.category}
            </span>
            <span className="text-xs font-bold text-[#1d1b19] truncate">
              {item.name}
            </span>
            <span className="font-price text-xs font-bold text-[#9f3c16] mt-0.5">
              ${Number(item.price).toLocaleString('es-MX')} MXN
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-[#f3ede9] hover:bg-[#ede7e3] text-[#1d1b19] text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(item.id)}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#832600] active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={14} />
                <span>Sí, eliminar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
