import { useEffect, useState } from 'react';

/** useState que se sincroniza con localStorage (tema, sesión, carrito...). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* modo privado o cuota llena: la app sigue funcionando sin persistir */
    }
  }, [key, value]);

  return [value, setValue];
}
