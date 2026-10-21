import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { loginUser } from '../../api';

export default function GestorLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-sm bg-[#fff8f4] rounded-3xl p-6 shadow-2xl border border-[#ede7e3]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors border border-[#dec0b7]/40"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#f3ede9] border border-[#dec0b7] flex items-center justify-center text-[#9f3c16] mb-3">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-serif-custom text-xl font-bold text-[#1d1b19]">
            Acceso Gestor
          </h3>
          <p className="text-xs text-[#706a62] mt-1">
            Mueblería Iglesias • Modificar catálogo y precios
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#57423b] uppercase tracking-wider mb-1">
              Usuario
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-[#8a726a]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-white text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-[#dec0b7] focus:border-[#9f3c16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#57423b] uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-[#8a726a]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-[#dec0b7] focus:border-[#9f3c16] focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-[#706a62] mt-1">
              (Credenciales: admin / admin123)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#9f3c16] hover:bg-[#832600] text-white text-xs font-semibold py-3 px-4 rounded-full transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>{loading ? 'Accediendo...' : 'Iniciar Sesión'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
