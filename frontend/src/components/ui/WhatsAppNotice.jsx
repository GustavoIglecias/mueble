import React from 'react';
import { ShieldCheck } from 'lucide-react';

// ─── WhatsAppNotice ──────────────────────────────────────────────────────────
// Aviso de seguridad que aparece cuando se hace click en un botón de WhatsApp
// y el navegador bloquea el popup. Se oculta automáticamente.
//
// Props:
//   message → string con el aviso (vacío = no renderiza)

export default function WhatsAppNotice({ message }) {
  if (!message) return null;

  return (
    <div className="px-3 py-2 rounded-lg bg-[#fff0eb] border border-[#f0c2b2] text-[11px] text-[#832600] flex items-center gap-2">
      <ShieldCheck size={13} className="text-[#9f3c16] shrink-0" />
      <span>{message}</span>
    </div>
  );
}
