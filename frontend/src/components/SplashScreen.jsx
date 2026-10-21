import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out at 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2200);

    // Completely unmount splash at 2.6 seconds
    const endTimer = setTimeout(() => {
      onFinish();
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-12 bg-[#fff8f4] text-[#1d1b19] transition-opacity duration-500 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Tag */}
      <div className="w-full flex justify-between items-center max-w-sm">
        <span className="text-[10px] uppercase tracking-widest text-[#8a726a] font-semibold">
          Colección Residencial
        </span>
        <button
          onClick={onFinish}
          className="text-[11px] font-medium text-[#706a62] hover:text-[#9f3c16] transition-colors"
        >
          Saltar →
        </button>
      </div>

      {/* Center: Brand Identity & Animation */}
      <div className="flex flex-col items-center text-center max-w-xs animate-fade-in">
        {/* Subtle decorative emblem */}
        <div className="w-16 h-16 rounded-2xl bg-[#f3ede9] border border-[#dec0b7] flex items-center justify-center mb-6 shadow-xs">
          <span className="font-serif-custom text-2xl font-bold text-[#9f3c16]">
            MI
          </span>
        </div>

        {/* Brand Name */}
        <div className="flex items-baseline space-x-2 mb-2">
          <h1 className="font-serif-custom text-3xl md:text-4xl font-bold tracking-tight text-[#1d1b19]">
            Mueblería
          </h1>
          <span className="font-serif-custom text-3xl md:text-4xl italic font-normal text-[#9f3c16]">
            Iglesias
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs md:text-sm text-[#706a62] tracking-wide font-normal mt-1">
          Diseños cálidos y a la medida para tu hogar
        </p>

        {/* Animated Loading Bar (fills in ~2 seconds) */}
        <div className="w-36 h-1 bg-[#ede7e3] rounded-full overflow-hidden mt-8 relative">
          <div className="h-full bg-[#9f3c16] rounded-full animate-[splashProgress_2.2s_ease-out_forwards]" />
        </div>
      </div>

      {/* Bottom Credits / Location */}
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-widest text-[#8a726a] font-medium">
          Mobiliario para casas y departamentos
        </span>
      </div>
    </div>
  );
}
