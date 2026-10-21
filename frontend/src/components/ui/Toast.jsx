import React from 'react';

// ─── Toast ───────────────────────────────────────────────────────────────────
// Notificación flotante temporal que aparece desde abajo.
// Controlada por el componente padre a través de la prop `message`.
//
// Props:
//   message → string con el texto a mostrar (vacío = oculto)

export default function Toast({ message }) {
  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1d1b19] text-white px-4 py-2.5 rounded-full shadow-xl text-[13px] font-medium flex items-center gap-2 pointer-events-none whitespace-nowrap transition-all duration-300 z-50 ${
        message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <svg className="w-4 h-4 text-[#9f3c16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
}
