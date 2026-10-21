import { useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/catalog';

// ─── useGestorAuth ───────────────────────────────────────────────────────────
// Encapsula el estado de autenticación del gestor: login, logout,
// persistencia en localStorage y apertura/cierre del modal de login.
//
// Uso:
//   const auth = useGestorAuth();
//   auth.gestorUser  → usuario logueado o null
//   auth.token       → JWT token o ''
//   auth.login(data) → guarda sesión
//   auth.logout()    → limpia sesión

export function useGestorAuth() {
  const [gestorUser, setGestorUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || ''
  );

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const login = ({ token: newToken, user }) => {
    setToken(newToken);
    setGestorUser(user);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    setIsLoginOpen(false);
  };

  const logout = () => {
    setGestorUser(null);
    setToken('');
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
  };

  return {
    gestorUser,
    token,
    isGestor: !!gestorUser,
    isLoginOpen,
    openLogin:  () => setIsLoginOpen(true),
    closeLogin: () => setIsLoginOpen(false),
    login,
    logout,
  };
}
