import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Sparkles, QrCode, Check, Share2, X, ShieldCheck } from 'lucide-react';
import { buildSecureWhatsAppUrl, openSecureWhatsApp } from '../../utils/whatsappSecurity';
import ImageGallery from './ImageGallery';
import SpecTable from './SpecTable';
import PriceTable from '../ui/PriceTable';
import WhatsAppNotice from '../ui/WhatsAppNotice';

// ─── ProductDetailModal ───────────────────────────────────────────────────────
// Modal de pantalla completa con la ficha técnica de un mueble.
// Incluye galería, precios, CTA de WhatsApp y especificaciones.

export default function ProductDetailModal({ item, onClose, onShowQR }) {
  if (!item) return null;

  // Normalizar galería de imágenes
  let images = [];
  if (item.images) {
    try {
      images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
    } catch {
      images = [item.image_url];
    }
  }
  if (!Array.isArray(images) || images.length === 0) {
    images = [item.image_url];
  }

  const [notice, setNotice] = useState('');

  const directProductUrl = `${window.location.origin}/?mueble=${item.id}`;

  const creditDetails = item.price_credit
    ? `\nCrédito: $${Number(item.price_credit).toLocaleString('es-MX')} MXN` +
      (item.weekly_payment && Number(item.weekly_payment) > 0
        ? ` ($${Number(item.weekly_payment).toLocaleString('es-MX')}/sem · ${Math.ceil(Number(item.price_credit) / Number(item.weekly_payment))} semanas)`
        : '')
    : '';

  const whatsappMessage =
    `Hola, me interesó este mueble 👇\n\n*${item.name}*\nCategoría: ${item.category}\nContado: $${Number(item.price).toLocaleString('es-MX')} MXN${creditDetails}\n\nEnlace de la pieza: ${directProductUrl}\n\n¿Me puede dar más información sobre requisitos y disponibilidad?`;

  const whatsappUrl = buildSecureWhatsAppUrl(whatsappMessage);

  const handleWhatsApp = (e) => {
    openSecureWhatsApp({
      message: whatsappMessage,
      event: e,
      onNotice: (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(''), 3000);
      },
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${item.name} · Mueblería Iglesias`,
        text: `Mira esta pieza de Mueblería Iglesias: ${item.name}`,
        url: directProductUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(directProductUrl);
      alert('Enlace del mueble copiado al portapapeles');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col w-full h-[100dvh] bg-[#fff8f4] overflow-hidden animate-fade-in"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="h-16 px-4 bg-[#fff8f4]/95 backdrop-blur-md border-b border-[#ede7e3] flex items-center justify-between shrink-0 z-20">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f3ede9] hover:bg-[#ede7e3] active:scale-95 text-[#1d1b19] font-semibold text-xs border border-[#dec0b7]/70 transition-all shadow-2xs"
          aria-label="Volver al catálogo"
        >
          <ArrowLeft size={18} className="text-[#9f3c16]" />
          <span>Volver</span>
        </button>

        <h1 className="font-serif-custom text-sm md:text-base font-medium text-[#1d1b19] truncate max-w-[160px] md:max-w-xs text-center">
          {item.name}
        </h1>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { onClose(); onShowQR(item); }}
            title="Ver código QR"
            className="w-9 h-9 rounded-full bg-[#f3ede9] flex items-center justify-center text-[#1d1b19] hover:text-[#9f3c16] transition-colors"
          >
            <QrCode size={17} />
          </button>
          <button
            onClick={handleShare}
            title="Compartir"
            className="w-9 h-9 rounded-full bg-[#f3ede9] flex items-center justify-center text-[#1d1b19] hover:text-[#9f3c16] transition-colors"
          >
            <Share2 size={17} />
          </button>
          <button
            onClick={onClose}
            title="Cerrar"
            className="w-9 h-9 rounded-full bg-[#f3ede9] hover:bg-[#ede7e3] active:scale-95 text-[#1d1b19] flex items-center justify-center transition-all border border-[#dec0b7]/60"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ── Contenido desplazable ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        <div className="max-w-md md:max-w-2xl mx-auto">

          {/* Contexto */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae1d7] text-[#1f1b15] text-[10px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9f3c16] animate-pulse" />
              Mobiliario Residencial • {item.category}
            </span>
            <span className="text-[11px] text-[#706a62] font-medium">Trato directo</span>
          </div>

          {/* Galería de imágenes */}
          <ImageGallery images={images} altBase={item.name} />

          {/* Identidad y precios */}
          <section className="px-5 mt-5 flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#8a726a] font-semibold">
                Mueblería Iglesias • {item.category}
              </span>
              <h2 className="font-serif-custom text-2xl md:text-3xl text-[#1d1b19] mt-0.5 font-medium leading-tight">
                {item.name}
              </h2>
              <p className="text-xs text-[#635e56] mt-1 leading-relaxed">
                {item.materials || 'Maderas nobles y acabados a mano'}
              </p>
            </div>

            <PriceTable item={item} variant="detail" />

            {/* Badges de características */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {item.price_credit && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3ede9] text-[#57423b] text-xs border border-[#dec0b7]/70">
                  <Check size={13} className="text-[#9f3c16]" />
                  <span>Crédito con INE y comprobante</span>
                </div>
              )}
              {item.is_compact === 1 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ede7e3] text-[#57423b] text-xs font-medium">
                  <Sparkles size={14} className="text-[#9f3c16]" />
                  <span>Ideal para espacios compactos</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3ede9] text-[#635e56] text-xs">
                <Check size={14} className="text-green-700" />
                <span>Pasa por puertas residenciales</span>
              </div>
            </div>
          </section>

          {/* CTA WhatsApp */}
          <section className="px-5 mt-5 flex flex-col gap-2">
            <a
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#9f3c16] text-white shadow-sm active:scale-[0.99] hover:bg-[#832600] transition-all group cursor-pointer"
              href={whatsappUrl}
              onClick={handleWhatsApp}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c1532b] flex items-center justify-center text-white">
                  <MessageCircle size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Consultar por WhatsApp
                  </span>
                  <span className="text-[11px] text-[#ffdbcf]">
                    Atención directa con la Familia Iglesias
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#ffdbcf] bg-white/10 px-2 py-1 rounded-md">
                <ShieldCheck size={12} className="text-green-300" />
                <span>Protegido</span>
              </div>
            </a>
            <WhatsAppNotice message={notice} />
          </section>

          {/* Ficha técnica */}
          <SpecTable item={item} />

          {/* Botón volver inferior */}
          <div className="px-5 mt-6 mb-8">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-[#f3ede9] hover:bg-[#ede7e3] active:scale-[0.98] text-[#1d1b19] font-semibold text-xs flex items-center justify-center gap-2 border border-[#dec0b7] transition-all shadow-2xs"
            >
              <ArrowLeft size={16} className="text-[#9f3c16]" />
              <span>Volver a la Lista de Muebles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
