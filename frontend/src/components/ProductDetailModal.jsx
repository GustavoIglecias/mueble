import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Ruler, Sparkles, QrCode, Check, ChevronLeft, ChevronRight, Share2, X, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { buildSecureWhatsAppUrl, openSecureWhatsApp } from '../utils/whatsappSecurity';

export default function ProductDetailModal({ item, onClose, onShowQR }) {
  if (!item) return null;

  // Extract gallery images safely
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [notice, setNotice] = useState('');

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Direct product URL for sharing & WhatsApp
  const directProductUrl = `${window.location.origin}/?mueble=${item.id}`;

  const creditDetails = item.price_credit
    ? `\nCrédito: $${Number(item.price_credit).toLocaleString('es-MX')} MXN` +
      (item.weekly_payment && Number(item.weekly_payment) > 0
        ? ` ($${Number(item.weekly_payment).toLocaleString('es-MX')}/sem · ${Math.ceil(Number(item.price_credit) / Number(item.weekly_payment))} semanas)`
        : '')
    : '';

  const whatsappMessage = `Hola, me interesó este mueble 👇\n\n*${item.name}*\nCategoría: ${item.category}\nContado: $${Number(item.price).toLocaleString('es-MX')} MXN${creditDetails}\n\nEnlace de la pieza: ${directProductUrl}\n\n¿Me puede dar más información sobre requisitos y disponibilidad?`;
  const whatsappUrl = buildSecureWhatsAppUrl(whatsappMessage);

  const handleWhatsAppAction = (e) => {
    openSecureWhatsApp({
      message: whatsappMessage,
      event: e,
      onNotice: (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(''), 3000);
      }
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
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {/* 1. TOP HEADER - PROTECTED FOR IPHONE NOTCH & DYNAMIC ISLAND */}
      <header className="h-16 px-4 bg-[#fff8f4]/95 backdrop-blur-md border-b border-[#ede7e3] flex items-center justify-between shrink-0 z-20">
        {/* Prominent Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f3ede9] hover:bg-[#ede7e3] active:scale-95 text-[#1d1b19] font-semibold text-xs border border-[#dec0b7]/70 transition-all shadow-2xs"
          aria-label="Volver al catálogo"
        >
          <ArrowLeft size={18} className="text-[#9f3c16]" />
          <span>Volver</span>
        </button>

        {/* Title */}
        <h1 className="font-serif-custom text-sm md:text-base font-medium text-[#1d1b19] truncate max-w-[160px] md:max-w-xs text-center">
          {item.name}
        </h1>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onClose();
              onShowQR(item);
            }}
            title="Ver código QR para muestra"
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

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        <div className="max-w-md md:max-w-2xl mx-auto">
          {/* Top Context Bar */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae1d7] text-[#1f1b15] text-[10px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9f3c16] animate-pulse" />
              Mobiliario Residencial • {item.category}
            </span>
            <span className="text-[11px] text-[#706a62] font-medium">
              Trato directo
            </span>
          </div>

          {/* Editorial Gallery Carousel (from Stitch ficha_detallada_del_mueble) */}
          <section className="px-5 mt-1 flex flex-col gap-2">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f3ede9] shadow-sm select-none group">
              {/* Active Image */}
              <img
                src={images[currentSlide]}
                alt={`${item.name} vista ${currentSlide + 1}`}
                className="w-full h-full object-cover transition-all duration-300 ease-out"
              />

              {/* Slide Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    aria-label="Foto anterior"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1d1b19] shadow-md backdrop-blur-xs flex items-center justify-center active:scale-95 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Siguiente foto"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1d1b19] shadow-md backdrop-blur-xs flex items-center justify-center active:scale-95 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badge Counter Pill ("1 / 4") */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#1d1b19] shadow-sm backdrop-blur-xs flex items-center gap-1 text-[11px] font-semibold border border-[#dec0b7]/50">
                <ImageIcon size={13} className="text-[#9f3c16]" />
                <span>{currentSlide + 1} / {images.length}</span>
              </div>

              {/* Pagination Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      currentSlide === idx ? 'border-[#9f3c16] scale-100 shadow-xs' : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product Identity */}
          {/* Product Identity */}
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

            {/* Tablero de Precios — 3 columnas uniformes (igual al catálogo) */}
            <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden border border-[#dec0b7] bg-[#dec0b7] shadow-xs">
              {/* Contado */}
              <div className="flex flex-col bg-white px-3.5 py-3">
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#8a726a] mb-1">Contado</span>
                <span className="font-price text-xl font-bold text-[#1d1b19] leading-tight">
                  ${Number(item.price).toLocaleString('es-MX')}
                </span>
                <span className="text-[10px] text-[#706a62] mt-0.5">MXN</span>
                <span className="text-[10px] text-[#635e56] mt-1.5 leading-snug">Entrega directa</span>
              </div>
              {/* A Crédito */}
              <div className="flex flex-col bg-white px-3.5 py-3 items-center text-center border-x border-[#dec0b7]">
                <span className="text-[9px] uppercase tracking-widest font-bold mb-1"
                  style={{ color: item.price_credit ? '#9f3c16' : '#b0a9a4' }}>
                  A Crédito
                </span>
                {item.price_credit ? (
                  <>
                    <span className="font-price text-xl font-bold text-[#9f3c16] leading-tight">
                      ${Number(item.price_credit).toLocaleString('es-MX')}
                    </span>
                    <span className="text-[10px] text-[#706a62] mt-0.5">MXN total</span>
                    <span className="text-[10px] text-[#635e56] mt-1.5 leading-snug">INE + comprobante</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-[#b0a9a4] font-medium mt-1">—</span>
                    <span className="text-[10px] text-[#b0a9a4] mt-1.5">Consultar</span>
                  </>
                )}
              </div>
              {/* Semanal */}
              <div className="flex flex-col bg-white px-3.5 py-3 items-end text-right">
                <span className="text-[9px] uppercase tracking-widest font-bold mb-1"
                  style={{ color: item.weekly_payment && Number(item.weekly_payment) > 0 ? '#9f3c16' : '#b0a9a4' }}>
                  Semanal
                </span>
                {item.weekly_payment && Number(item.weekly_payment) > 0 ? (
                  <>
                    <span className="font-price text-xl font-bold text-[#9f3c16] leading-tight">
                      ${Number(item.weekly_payment).toLocaleString('es-MX')}
                    </span>
                    <span className="text-[10px] text-[#706a62] mt-0.5">/ semana</span>
                    <span className="text-[10px] text-[#9f3c16] font-semibold mt-1.5">
                      {item.price_credit
                        ? `${Math.ceil(Number(item.price_credit) / Number(item.weekly_payment))} semanas`
                        : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-[#b0a9a4] font-medium mt-1">—</span>
                    <span className="text-[10px] text-[#b0a9a4] mt-1.5">Sin datos</span>
                  </>
                )}
              </div>
            </div>

            {/* Requisitos y ventajas clave */}
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

          {/* Primary Call to Action: WhatsApp Direct Concierge */}
          <section className="px-5 mt-5 flex flex-col gap-2">
            <a
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#9f3c16] text-white shadow-sm active:scale-[0.99] hover:bg-[#832600] transition-all group cursor-pointer"
              href={whatsappUrl}
              onClick={handleWhatsAppAction}
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

            {notice && (
              <div className="px-3 py-2 rounded-lg bg-[#fff0eb] border border-[#f0c2b2] text-[11px] text-[#832600] flex items-center gap-2">
                <ShieldCheck size={13} className="text-[#9f3c16]" />
                <span>{notice}</span>
              </div>
            )}
          </section>

          {/* Dimension & Specification Table */}
          <section className="px-5 mt-5 flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wider text-[#635e56] font-semibold">
              Dimensiones y Ficha Técnica
            </h3>
            <div className="bg-[#f9f2ef] rounded-xl p-4 border border-[#ede7e3] flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#ede7e3]">
                <span className="text-[#635e56]">Medidas generales</span>
                <span className="font-semibold text-[#1d1b19]">{item.dimensions}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#ede7e3]">
                <span className="text-[#635e56]">Categoría</span>
                <span className="font-semibold text-[#1d1b19]">{item.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#ede7e3]">
                <span className="text-[#635e56]">Adaptabilidad</span>
                <span className="font-semibold text-[#1d1b19]">
                  {item.is_compact === 1 ? 'Optimizada para casas chicas' : 'Espacio estándar'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#635e56]">Entrega</span>
                <span className="font-semibold text-[#1d1b19]">Directo a tu privada</span>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div className="mt-2">
                <h4 className="text-xs uppercase tracking-wider text-[#635e56] font-semibold mb-1">
                  Descripción
                </h4>
                <p className="text-xs text-[#463832] leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}
          </section>

          {/* SECONDARY BOTTOM BACK BUTTON - ALWAYS ACCESSIBLE */}
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
