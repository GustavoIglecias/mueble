import React from 'react';

// ─── SpecTable ────────────────────────────────────────────────────────────────
// Tabla de especificaciones técnicas de un mueble: medidas, categoría,
// adaptabilidad y entrega.

export default function SpecTable({ item }) {
  const rows = [
    { label: 'Medidas generales', value: item.dimensions },
    { label: 'Categoría',         value: item.category },
    {
      label: 'Adaptabilidad',
      value: item.is_compact === 1 ? 'Optimizada para casas chicas' : 'Espacio estándar',
    },
    { label: 'Entrega', value: 'Directo a tu privada' },
  ];

  return (
    <section className="px-5 mt-5 flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-wider text-[#635e56] font-semibold">
        Dimensiones y Ficha Técnica
      </h3>

      <div className="bg-[#f9f2ef] rounded-xl p-4 border border-[#ede7e3] flex flex-col gap-2.5 text-xs">
        {rows.map((row, idx) => (
          <div
            key={row.label}
            className={`flex justify-between py-1.5 ${idx < rows.length - 1 ? 'border-b border-[#ede7e3]' : ''}`}
          >
            <span className="text-[#635e56]">{row.label}</span>
            <span className="font-semibold text-[#1d1b19] text-right max-w-[55%]">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Descripción */}
      {item.description && (
        <div className="mt-2">
          <h4 className="text-xs uppercase tracking-wider text-[#635e56] font-semibold mb-1">
            Descripción
          </h4>
          <p className="text-xs text-[#463832] leading-relaxed">{item.description}</p>
        </div>
      )}
    </section>
  );
}
