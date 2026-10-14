import { Beer, CircleAlert, Coffee, FlaskConical, Grape, Leaf, Martini, Milk, RefreshCw, Search, SearchX, Wine, X } from 'lucide-react';
import { Profiler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SECCIONES, normalizeList } from '../api/cocktails.js';
import { useCartActions } from '../context/CartContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useFetch } from '../hooks/useFetch.js';
import { recordCommit } from '../utils/profilerStore.js';
import DrinkCard from './DrinkCard.jsx';
import Skeleton from './Skeleton.jsx';

const ICONOS = { Martini, Grape, Wine, FlaskConical, Coffee, Beer, Leaf, Milk };
const PAGINA = 12;

const sinTildes = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Menu({ onOpen }) {
  const [seccionId, setSeccionId] = useState(SECCIONES[0].id);
  const [query, setQuery] = useState('');
  const [orden, setOrden] = useState('az');
  const [visibles, setVisibles] = useState(PAGINA);
  const searchRef = useRef(null); // useRef: enfocar el buscador sin provocar re-render

  const seccion = SECCIONES.find((s) => s.id === seccionId);
  const { data, loading, error, refetch } = useFetch(seccion.url);

  // Solo usamos las ACCIONES del carrito: la Carta no se re-renderiza cuando cambia el carrito
  const { add } = useCartActions();
  const handleAdd = useCallback((drink) => add(drink), [add]);

  // IA: filtrar en cada tecla recalculaba la lista completa → Solución manual: useDebounce (300 ms)
  // sobre el texto y useMemo para que el filtro solo corra con valores ya "asentados".
  const busqueda = useDebounce(query, 300);
  const tragos = useMemo(() => normalizeList(data), [data]);

  // PASO 4 · useMemo: el filtrado/ordenamiento pesado solo se recalcula si cambia algo relevante
  const filtrados = useMemo(() => {
    const q = sinTildes(busqueda.trim());
    const lista = q ? tragos.filter((t) => sinTildes(t.name).includes(q)) : tragos;
    const copia = [...lista];
    if (orden === 'az') copia.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (orden === 'precio-asc') copia.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    if (orden === 'precio-desc') copia.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    return copia;
  }, [tragos, busqueda, orden]);

  // Atajo de teclado "/" para ir al buscador. El cleanup quita el listener.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cambiarSeccion = (id) => {
    setSeccionId(id);
    setVisibles(PAGINA);
  };
  const cambiarQuery = (e) => {
    setQuery(e.target.value);
    setVisibles(PAGINA);
  };
  const limpiar = () => {
    setQuery('');
    setVisibles(PAGINA);
    searchRef.current?.focus();
  };

  return (
    <Profiler id="Carta" onRender={recordCommit}>
      <section id="carta" className="seccion contenedor" aria-labelledby="carta-titulo">
        <div className="seccion__cabeza">
          <h2 id="carta-titulo">La carta</h2>
          <p>Catálogo en vivo desde TheCocktailDB. Toca un trago para ver ingredientes y preparación.</p>
        </div>

        <div className="chips" role="tablist" aria-label="Secciones de la carta">
          {SECCIONES.map((s) => {
            const Icono = ICONOS[s.icono];
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === seccionId}
                className={`chip ${s.id === seccionId ? 'chip--activo' : ''}`}
                onClick={() => cambiarSeccion(s.id)}
              >
                <Icono size={17} aria-hidden="true" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="herramientas">
          <div className="buscador">
            <Search size={18} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={cambiarQuery}
              placeholder={`Buscar en ${seccion.label.toLowerCase()}…`}
              aria-label="Buscar trago"
            />
            {query ? (
              <button type="button" className="buscador__limpiar" onClick={limpiar} aria-label="Limpiar búsqueda">
                <X size={16} />
              </button>
            ) : (
              <kbd aria-hidden="true">/</kbd>
            )}
          </div>
          <label className="orden">
            <span className="sr-only">Ordenar por</span>
            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="az">Nombre A–Z</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        {loading && <Skeleton count={8} />}

        {error && (
          <div className="estado" role="alert">
            <CircleAlert size={32} aria-hidden="true" />
            <h3>No pudimos abrir la carta</h3>
            <p>{error.message}. Revisa tu conexión a internet e inténtalo de nuevo.</p>
            <button type="button" className="btn btn--primario" onClick={refetch}>
              <RefreshCw size={18} aria-hidden="true" /> Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filtrados.length === 0 && (
          <div className="estado">
            <SearchX size={32} aria-hidden="true" />
            <h3>Nada por aquí</h3>
            <p>{busqueda ? `No hay tragos que coincidan con “${busqueda}” en esta sección.` : 'Esta sección está vacía por ahora.'}</p>
          </div>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <>
            <p className="conteo" aria-live="polite">
              Mostrando {Math.min(visibles, filtrados.length)} de {filtrados.length} tragos
            </p>
            <div className="grilla">
              {filtrados.slice(0, visibles).map((t) => (
                <DrinkCard key={t.id} drink={t} onOpen={onOpen} onAdd={handleAdd} />
              ))}
            </div>
            {visibles < filtrados.length && (
              <div className="centrado">
                <button type="button" className="btn btn--contorno" onClick={() => setVisibles((v) => v + PAGINA)}>
                  Ver más tragos
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Profiler>
  );
}
