import { useCallback, useEffect, useState } from 'react';

/**
 * PASO 2 + PASO 5 · Hook personalizado useFetch
 *
 * - async/await dentro de useEffect (no .then())
 * - array de dependencias: [url, tick]
 * - función de limpieza con AbortController (evita memory leaks y respuestas viejas)
 *
 * ¿Por qué [] ≠ "se ejecuta una sola vez" en StrictMode?
 * En desarrollo, React 18 monta -> desmonta -> vuelve a montar cada componente para
 * comprobar que el cleanup está bien escrito. Un efecto con [] corre DOS veces en dev.
 * El array solo dice "vuelve a correr si cambia algo"; no garantiza una única ejecución.
 * Por eso el cleanup aborta la primera petición y la segunda es la válida.
 */
export function useFetch(url) {
  const [state, setState] = useState({ url: null, data: null, loading: Boolean(url), error: null });
  const [tick, setTick] = useState(0); // sube para forzar un "refetch" con la misma URL

  useEffect(() => {
    if (!url) return undefined;

    const controller = new AbortController();

    async function load() {
      setState((s) => ({ ...s, url, loading: true, error: null }));
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);
        const data = await res.json();
        setState({ url, data, loading: false, error: null });
      } catch (err) {
        if (err.name === 'AbortError') return; // petición cancelada a propósito: no es un error
        setState({ url, data: null, loading: false, error: err });
      }
    }

    load();
    return () => controller.abort();
  }, [url, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  // IA: al cambiar de URL se veía un frame con los datos de la URL anterior → Solución manual:
  // guardo la url dentro del estado y, si no coincide con la actual, devuelvo "cargando" sin datos.
  if (!url) return { data: null, loading: false, error: null, refetch };
  if (state.url !== url) return { data: null, loading: true, error: null, refetch };
  return { data: state.data, loading: state.loading, error: state.error, refetch };
}
