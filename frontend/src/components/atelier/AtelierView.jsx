import React, { useState } from 'react';
import { Trees, Hammer, ShieldCheck, Quote, MessageCircle, MapPin, Clock } from 'lucide-react';
import { buildSecureWhatsAppUrl, openSecureWhatsApp } from '../../utils/whatsappSecurity';

export default function AtelierView() {
  const [notice, setNotice] = useState('');
  const defaultMsg = '¡Hola Mueblería Iglesias! Me gustaría conocer más sobre las piezas del taller y agendar una visita directa.';
  const whatsappUrl = buildSecureWhatsAppUrl(defaultMsg);

  const handleWhatsApp = (e) => {
    openSecureWhatsApp({
      message: defaultMsg,
      event: e,
      onNotice: (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(''), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* 1. Hero Editorial del Atelier (from Stitch atelier_casa_lento) */}
      <section className="relative px-5 pt-4 pb-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae1d7] text-[#1f1b15] text-[10px] font-semibold uppercase tracking-widest shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9f3c16] animate-pulse" />
            Venta directa • Sin local comercial
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="font-serif-custom text-3xl md:text-4xl text-[#1d1b19] leading-tight font-normal">
            El Oficio de la Calma
          </h1>
          <p className="text-xs md:text-sm text-[#635e56] leading-relaxed">
            Un espacio donde el tiempo no se mide en minutos, sino en vetas, ensambles tradicionales y el reposo paciente de la madera noble.
          </p>
        </div>

        {/* Atelier Atmosphere Photo */}
        <div className="relative w-full rounded-xl overflow-hidden bg-[#f3ede9] shadow-sm">
          <img
            className="w-full h-64 md:h-80 object-cover object-center"
            alt="Taller Mueblería Iglesias"
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b19]/80 via-transparent to-transparent flex items-end p-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#ede7e3]">
                  Modalidad
                </span>
                <span className="text-xs text-white font-medium">
                  Exhibición de paso &amp; Venta directa
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-white font-semibold">
                Familia Iglesias
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Manifiesto / Filosofía de Producción Lenta (from Stitch atelier_casa_lento) */}
      <section className="px-5 py-4 flex flex-col gap-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[#9f3c16] uppercase tracking-widest font-semibold">
            Filosofía
          </span>
          <h2 className="font-serif-custom text-2xl text-[#1d1b19] font-medium">
            Manifiesto del Oficio
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* Principio I */}
          <article className="p-4 rounded-xl bg-[#f9f2ef] border border-[#ede7e3] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-serif-custom text-xl text-[#9f3c16] font-normal">I</span>
              <Trees size={18} className="text-[#635e56]" />
            </div>
            <h3 className="text-xs font-bold text-[#1d1b19]">Materia Viva &amp; Trazabilidad</h3>
            <p className="text-xs text-[#635e56] leading-relaxed">
              Madera de roble, nogal, encino y parota secadas naturalmente al aire para evitar grietas o torceduras antes de tocar el banco de trabajo.
            </p>
          </article>

          {/* Principio II */}
          <article className="p-4 rounded-xl bg-[#f9f2ef] border border-[#ede7e3] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-serif-custom text-xl text-[#9f3c16] font-normal">II</span>
              <Hammer size={18} className="text-[#635e56]" />
            </div>
            <h3 className="text-xs font-bold text-[#1d1b19]">Ensambles Tradicionales</h3>
            <p className="text-xs text-[#635e56] leading-relaxed">
              Colas de milano vistas, caja y espiga pasante. Uniones que respiran con los cambios de clima y humedad sin tornillos débiles.
            </p>
          </article>

          {/* Principio III */}
          <article className="p-4 rounded-xl bg-[#f9f2ef] border border-[#ede7e3] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-serif-custom text-xl text-[#9f3c16] font-normal">III</span>
              <ShieldCheck size={18} className="text-[#635e56]" />
            </div>
            <h3 className="text-xs font-bold text-[#1d1b19]">Proporciones a Escala Humana</h3>
            <p className="text-xs text-[#635e56] leading-relaxed">
              Cada mueble está pensado para casas reales: fondos compactos que dejan circular libremente y alturas que aportan ligereza visual.
            </p>
          </article>
        </div>
      </section>

      {/* 3. Las Manos Creadoras (from Stitch atelier_casa_lento) */}
      <section className="px-5 py-4 flex flex-col gap-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[#9f3c16] uppercase tracking-widest font-semibold">
            Manos Creadoras
          </span>
          <h2 className="font-serif-custom text-2xl text-[#1d1b19] font-medium">
            El Maestro del Taller
          </h2>
        </div>

        {/* Craft Quote Card */}
        <div className="p-4 rounded-xl bg-[#ffdbcf] text-[#390c00] flex flex-col gap-2 border border-[#dec0b7]">
          <Quote size={24} className="text-[#9f3c16]" />
          <p className="font-serif-custom text-base leading-snug italic font-normal text-[#390c00]">
            “No fabricamos muebles rápidos; creamos piezas que envejecerán con gracia, dignidad y mejor que nosotros.”
          </p>
          <span className="text-[10px] text-[#822801] tracking-wider uppercase font-semibold">
            — Sr. Iglesias, Maestro del Taller
          </span>
        </div>

        {/* Profile Card */}
        <div className="p-3.5 rounded-xl bg-[#f3ede9] flex items-center gap-3.5 border border-[#ede7e3]">
          <div className="w-14 h-14 rounded-lg bg-[#dec0b7] overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
              alt="Maestro Iglesias"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs font-bold text-[#1d1b19]">Familia Iglesias</h4>
            <span className="text-[11px] text-[#9f3c16] font-medium">Oficio de Ebanistería &amp; Diseño</span>
            <span className="text-[10px] text-[#706a62] mt-0.5">Trato personal y directo con cada cliente</span>
          </div>
        </div>
      </section>

      {/* 4. El Proceso en 4 Pasos (from Stitch atelier_casa_lento) */}
      <section className="px-5 py-4 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[#9f3c16] uppercase tracking-widest font-semibold">
            Paso a Paso
          </span>
          <h2 className="font-serif-custom text-xl text-[#1d1b19] font-medium">
            De la Corteza al Hogar
          </h2>
          <p className="text-xs text-[#635e56]">
            El método tradicional que garantiza resistencia por décadas.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#9f3c16] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <h3 className="text-xs font-bold text-[#1d1b19]">Selección de tabla y lectura de veta</h3>
              <p className="text-xs text-[#635e56]">
                Elegimos cada veta para que conviva en armonía con la luz y la humedad de tu hogar.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#ede7e3] text-[#1d1b19] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <h3 className="text-xs font-bold text-[#1d1b19]">Corte y ensamble en banco tradicional</h3>
              <p className="text-xs text-[#635e56]">
                Uniones maquinadas con precisión milimétrica por fricción y espiga de madera dura.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#ede7e3] text-[#1d1b19] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <h3 className="text-xs font-bold text-[#1d1b19]">Nutrición con ceras y aceites naturales</h3>
              <p className="text-xs text-[#635e56]">
                Acabados frotados a mano con ceras ecológicas para un tacto sedoso y transpirable.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#ede7e3] text-[#1d1b19] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              4
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <h3 className="text-xs font-bold text-[#1d1b19]">Entrega directa en tu puerta</h3>
              <p className="text-xs text-[#635e56]">
                Llevamos el mueble directamente a tu casa residencial para asegurar su colocación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Muestras del Banco / Maderas */}
      <section className="px-5 py-4">
        <div className="bg-[#f9f2ef] rounded-xl p-4 border border-[#ede7e3] flex flex-col gap-3">
          <span className="text-[10px] text-[#635e56] uppercase tracking-wider font-semibold">
            Muestras de Materiales
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#5a4332] text-white p-2.5 rounded-lg text-xs font-medium">
              Roble Tostado
            </div>
            <div className="bg-[#8b5a2b] text-white p-2.5 rounded-lg text-xs font-medium">
              Nogal Cálido
            </div>
            <div className="bg-[#d4b996] text-[#1d1b19] p-2.5 rounded-lg text-xs font-medium">
              Encino Claro
            </div>
          </div>
          <p className="text-[11px] text-[#706a62] text-center">
            Tratamientos al aceite mate que resaltan la textura natural de la madera.
          </p>
        </div>
      </section>

      {/* 6. Conoce el Atelier / Contacto CTA */}
      <section className="px-5 pb-4">
        <div className="bg-[#f3ede9] rounded-xl p-5 border border-[#ede7e3] flex flex-col gap-3">
          <h3 className="font-serif-custom text-lg font-medium text-[#1d1b19]">
            ¿Tienes dudas sobre medidas o maderas?
          </h3>
          <p className="text-xs text-[#635e56] leading-relaxed">
            Conversa directamente con nosotros para ayudarte a elegir la pieza ideal para tu casa.
          </p>
          <a
            href={whatsappUrl}
            onClick={handleWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#9f3c16] hover:bg-[#832600] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>Consultar con la Familia Iglesias</span>
          </a>
          {notice && (
            <div className="mt-1 px-3 py-2 rounded-lg bg-[#fff0eb] border border-[#f0c2b2] text-[11px] text-[#832600] flex items-center gap-2">
              <ShieldCheck size={13} className="text-[#9f3c16]" />
              <span>{notice}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
