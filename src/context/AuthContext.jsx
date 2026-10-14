import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

// PASO 3 · Contexto de SESIÓN (demo: no hay servidor, solo persiste en localStorage)
const AuthContext = createContext(null);

const nombreDesdeCorreo = (email) => {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
};

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('kuntur-sesion', null);
  const [loginOpen, setLoginOpen] = useState(false);

  const login = useCallback(
    (email) => {
      setUser({ email: email.trim().toLowerCase(), nombre: nombreDesdeCorreo(email) });
      setLoginOpen(false);
    },
    [setUser],
  );
  const logout = useCallback(() => setUser(null), [setUser]);
  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const value = useMemo(
    () => ({ user, login, logout, loginOpen, openLogin, closeLogin }),
    [user, login, logout, loginOpen, openLogin, closeLogin],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
