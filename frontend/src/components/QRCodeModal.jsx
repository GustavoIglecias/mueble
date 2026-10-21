import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export default function QRCodeModal({ item, onClose }) {
  if (!item) return null;

  const itemUrl = `${window.location.origin}/?mueble=${item.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#ede7e3] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        {/* Printable Card Area */}
        <div className="p-3 bg-[#fff8f4] rounded-2xl border border-[#ede7e3] print:border-none print:p-0">
          <div className="flex items-center justify-center space-x-1.5 mb-1">
            <span className="font-serif-custom text-xl font-bold text-[#1d1b19]">Mueblería</span>
            <span className="font-serif-custom text-xl italic font-normal text-[#9f3c16]">Iglesias</span>
          </div>

          <p className="text-[10px] text-[#706a62] uppercase tracking-widest font-semibold mb-3">
            Muestra de Exhibición Residencial
          </p>

          {/* QR Code Container */}
          <div className="bg-white p-3 rounded-2xl inline-block shadow-xs border border-[#dec0b7] mb-3">
            <QRCodeSVG
              value={itemUrl}
              size={170}
              level="H"
              includeMargin={true}
              fgColor="#1d1b19"
            />
          </div>

          <h3 className="font-serif-custom text-lg font-bold text-[#1d1b19] mb-0.5">
            {item.name}
          </h3>
          <p className="text-xs text-[#635e56] mb-1 font-sans">
            {item.dimensions}
          </p>
          <p className="text-base font-bold text-[#9f3c16]">
            ${Number(item.price).toLocaleString('es-MX')} MXN
          </p>

          <p className="text-[11px] text-[#706a62] mt-3">
            Escanea con tu celular para ver fotos, medidas y pedir entrega a tu casa.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#9f3c16] hover:bg-[#832600] text-white py-2.5 px-4 rounded-full text-xs font-semibold transition-colors shadow-xs"
          >
            <Printer size={15} />
            <span>Imprimir etiqueta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
