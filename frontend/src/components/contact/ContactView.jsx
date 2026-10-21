import React, { useState } from 'react';
import {
  MessageCircle, MapPin, Clock, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, Home, Truck, CreditCard, Code2, Mail
} from 'lucide-react';
import { buildSecureWhatsAppUrl, openSecureWhatsApp } from '../../utils/whatsappSecurity';

const FAQ = [
  {
    q: '¿Hacen muebles a medida o solo venden los del catálogo?',
    a: 'Sí, podemos ajustar las medidas de cualquier pieza del catálogo sin costo extra. Para piezas completamente personalizadas, contáctenos por WhatsApp y le damos un presupuesto según sus necesidades.',
  },
  {
    q: '¿Cuánto tiempo tarda la entrega después de apartar una pieza?',
    a: 'Las piezas en existencia se entregan en 2 a 5 días hábiles dentro de Los Héroes Ixtapaluca. Para piezas por encargo, el tiempo habitual es de 3 a 4 semanas según el modelo y materiales.',
  },
  {
    q: '¿Puedo comprar a crédito si soy inquilino (no soy dueño)?',
    a: 'Sí. Los inquilinos necesitan presentar INE vigente + último recibo de luz o agua + un aval (familiar o conocido que sea propietario). Consúltenos por WhatsApp y le orientamos sin compromiso.',
  },
];

export default function ContactView() {
  const [notice, setNotice] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const defaultMsg = '¡Hola Mueblería Iglesias! Me gustaría consultar sobre sus muebles, opciones de pago a crédito y entregas en Los Héroes Ixtapaluca.';
  const whatsappUrl = buildSecureWhatsAppUrl(defaultMsg);

  const handleWhatsApp = (e) => {
    openSecureWhatsApp({
      message: defaultMsg,
      event: e,
      onNotice: (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(''), 3000);
      },
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-4xl mx-auto px-5 pt-4 pb-4 animate-fade-in">

      {/* ── 1. ENCABEZADO ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-[#eae1d7]/60 px-3 py-1.5 rounded-full text-[#1f1b15] mb-3 border border-[#dec0b7]/70">
          <span className="w-2 h-2 rounded-full bg-[#9f3c16] animate-pulse" />
          <span className="text-[10px] font-semibold tracking-widest uppercase">
            Los Héroes Ixtapaluca • Sin tienda física
          </span>
        </div>
        <h1 className="font-serif-custom text-3xl md:text-4xl text-[#1d1b19] leading-tight font-normal">
          Escríbanos sin<br />
          <span className="italic font-normal text-[#9f3c16]">compromiso</span>
        </h1>
        <p className="text-xs md:text-sm text-[#635e56] leading-relaxed mt-2">
          Vendemos directamente en exposiciones en Los Héroes Ixtapaluca y colonias cercanas.
          Sin intermediarios — trato personal con la Familia Iglesias.
        </p>
      </div>

      {/* ── 2. WHATSAPP PRINCIPAL ──────────────────────────────────────── */}
      <section className="mb-5">
        <span className="text-[10px] uppercase tracking-widest text-[#635e56] font-semibold block mb-2.5">
          Canal principal
        </span>
        <a
          href={whatsappUrl}
          onClick={handleWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#9f3c16] text-white p-5 rounded-xl shadow-md hover:bg-[#832600] transition-all active:scale-[0.99] group cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <MessageCircle size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold tracking-wide uppercase">
                  WhatsApp · Familia Iglesias
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] text-[#ffdbcf] bg-white/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} className="text-green-300" />
                  Protegido
                </span>
              </div>
              <p className="text-[12px] text-[#ffdbcf] leading-snug mb-3">
                Pida fotos de maderas actuales, consulte precios de crédito o agende que llevemos
                una muestra a su privada en Los Héroes Ixtapaluca.
              </p>
              <div className="inline-flex items-center gap-1.5 text-white text-xs font-semibold">
                <span>Iniciar conversación</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </a>
        {notice && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-[#fff0eb] border border-[#f0c2b2] text-[11px] text-[#832600] flex items-center gap-2">
            <ShieldCheck size={13} className="text-[#9f3c16]" />
            <span>{notice}</span>
          </div>
        )}
      </section>

      {/* ── 3. ZONA DE ENTREGA + HORARIO ──────────────────────────────── */}
      <section className="mb-5 grid grid-cols-2 gap-3">
        {/* Zona */}
        <div className="bg-[#f9f2ef] rounded-xl p-4 border border-[#ede7e3] flex flex-col gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#ffdbcf] flex items-center justify-center text-[#9f3c16]">
            <MapPin size={18} />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-[#8a726a] font-semibold">
            Zona de entrega
          </span>
          <p className="text-[12px] text-[#1d1b19] font-semibold leading-snug">
            Los Héroes Ixtapaluca
          </p>
          <p className="text-[11px] text-[#635e56] leading-snug">
            y colonias circundantes en el Edo. de México
          </p>
        </div>
        {/* Horario */}
        <div className="bg-[#f9f2ef] rounded-xl p-4 border border-[#ede7e3] flex flex-col gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#ffdbcf] flex items-center justify-center text-[#9f3c16]">
            <Clock size={18} />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-[#8a726a] font-semibold">
            Atención
          </span>
          <p className="text-[12px] text-[#1d1b19] font-semibold leading-snug">
            Lun – Sáb
          </p>
          <p className="text-[11px] text-[#635e56]">10:00 a 19:00 hrs</p>
        </div>
      </section>

      {/* ── 4. POLÍTICA DE CRÉDITO RÁPIDA ────────────────────────────── */}
      <section className="mb-5">
        <div className="bg-[#fff8f4] rounded-xl border border-[#f0c2b2] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-[#9f3c16]" />
            <span className="text-[11px] font-bold text-[#9f3c16] uppercase tracking-wider">
              Requisitos para compra a crédito
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#9f3c16] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] text-white font-bold">1</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#1d1b19]">INE vigente</p>
                <p className="text-[11px] text-[#635e56]">Identificación oficial del comprador</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#9f3c16] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] text-white font-bold">2</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#1d1b19]">Comprobante de domicilio</p>
                <p className="text-[11px] text-[#635e56]">Escrituras (propietario) o recibo de luz/agua (inquilino)</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#dec0b7] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] text-[#635e56] font-bold">+</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#1d1b19]">Aval (solo inquilinos)</p>
                <p className="text-[11px] text-[#635e56]">Familiar o conocido propietario de su vivienda</p>
              </div>
            </div>
          </div>
          <a
            href={whatsappUrl}
            onClick={handleWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-full py-2.5 rounded-lg bg-[#9f3c16] hover:bg-[#832600] text-white text-[12px] font-semibold text-center transition-colors"
          >
            Consultar opciones de financiamiento
          </a>
        </div>
      </section>

      {/* ── 5. ZONA DE ENTREGA A DOMICILIO ───────────────────────────── */}
      <section className="mb-5">
        <div className="bg-[#f9f2ef] rounded-xl border border-[#ede7e3] p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#ffdbcf] flex items-center justify-center text-[#9f3c16] shrink-0">
            <Truck size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#1d1b19]">Llevamos la muestra a su casa</p>
            <p className="text-[11px] text-[#635e56] leading-snug mt-0.5">
              ¿Quiere ver cómo queda el mueble en su espacio antes de decidir? Lo llevamos sin costo en Los Héroes y alrededores.
            </p>
          </div>
          <a
            href={buildSecureWhatsAppUrl('Hola, me gustaría que llevaran una muestra a mi domicilio en Los Héroes Ixtapaluca para ver cómo queda el mueble.')}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#ede7e3] hover:bg-[#dec0b7] text-[#1d1b19] text-[11px] font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            Pedir
          </a>
        </div>
      </section>

      {/* ── 6. PREGUNTAS FRECUENTES ──────────────────────────────────── */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest text-[#635e56] font-semibold">
            Preguntas frecuentes
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="bg-[#f9f2ef] rounded-xl border border-[#ede7e3] overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-start justify-between gap-3 p-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-[12px] font-semibold text-[#1d1b19] leading-snug">
                  {item.q}
                </span>
                {openFaq === i
                  ? <ChevronUp size={16} className="text-[#9f3c16] shrink-0 mt-0.5" />
                  : <ChevronDown size={16} className="text-[#635e56] shrink-0 mt-0.5" />
                }
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-0">
                  <div className="w-full h-px bg-[#ede7e3] mb-3" />
                  <p className="text-[12px] text-[#57423b] leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. FOOTER / CRÉDITO DEL DESARROLLADOR ────────────────────── */}
      <footer className="border-t border-[#ede7e3] pt-5 pb-2 flex flex-col gap-3">
        {/* Copyright mueblería */}
        <div className="flex items-center justify-between text-[11px] text-[#8a726a]">
          <div className="flex items-center gap-1.5">
            <Home size={13} className="text-[#9f3c16]" />
            <span>© {new Date().getFullYear()} Casa Iglesias · Mueblería Artesanal</span>
          </div>
          <span className="text-[10px] text-[#b0a9a4]">Ixtapaluca, Méx.</span>
        </div>

        {/* Crédito desarrollador */}
        <div className="flex items-center justify-between bg-[#f9f2ef] rounded-xl px-4 py-3 border border-[#ede7e3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1d1b19] flex items-center justify-center">
              <Code2 size={14} className="text-[#ffdbcf]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#635e56]">Sitio web desarrollado por</span>
              <span className="text-[12px] font-bold text-[#1d1b19]">Gustavo Iglecias</span>
            </div>
          </div>
          <a
            href="mailto:igleciasguzmanguillermogustavo@gmail.com"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1d1b19] hover:bg-[#2d2925] text-white text-[11px] font-semibold transition-colors"
            title="Contactar al desarrollador"
          >
            <Mail size={12} />
            <span className="hidden sm:inline">Contactar</span>
          </a>
        </div>
      </footer>

    </div>
  );
}
