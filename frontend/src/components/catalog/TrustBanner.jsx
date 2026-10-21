import React from 'react';
import { ShieldCheck, Hammer, Trees, UserCheck, BookOpen } from 'lucide-react';

// ─── TrustBanner ─────────────────────────────────────────────────────────────
// Banner inferior del catálogo: "Compromiso Mueblería Iglesias"
// con los 3 pilares de confianza y acceso a la historia del taller.

export default function TrustBanner({ onGoAtelier }) {
  return (
    <section className="px-5 pb-6">
      <div className="bg-[#f3ede9] rounded-xl p-5 flex flex-col gap-4 shadow-[0_2px_12px_rgba(29,27,25,0.02)] border border-[#ede7e3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffdbcf] flex items-center justify-center text-[#9f3c16] shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-serif-custom text-base text-[#1d1b19] font-medium">
              Compromiso Mueblería Iglesias
            </h4>
            <p className="text-[10px] text-[#635e56] uppercase tracking-wider font-semibold">
              Filosofía de taller local &amp; Oficio
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex items-start gap-2.5">
            <Hammer size={17} className="text-[#9f3c16] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1d1b19] leading-relaxed">
              <strong className="font-semibold">Garantía estructural</strong> en todas las uniones
              de madera maciza y herrería.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Trees size={17} className="text-[#9f3c16] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1d1b19] leading-relaxed">
              <strong className="font-semibold">Madera noble seleccionada</strong> secada y trabajada
              para evitar torceduras o grietas.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <UserCheck size={17} className="text-[#9f3c16] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1d1b19] leading-relaxed">
              <strong className="font-semibold">Trato directo con la Familia Iglesias</strong> para
              resolver dudas o adaptar medidas a tu casa.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onGoAtelier}
            className="w-full bg-[#fff8f4] hover:bg-[#ede7e3] text-[#1d1b19] py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors shadow-xs border border-[#dec0b7]/50"
          >
            <span>Conoce la historia del taller</span>
            <BookOpen size={15} className="text-[#9f3c16]" />
          </button>
        </div>
      </div>
    </section>
  );
}
