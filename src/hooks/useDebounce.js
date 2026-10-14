import { useEffect, useState } from 'react';

/** Devuelve `value` solo después de que dejó de cambiar durante `delay` ms. */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // limpieza: cancela el timer pendiente
  }, [value, delay]);

  return debounced;
}
