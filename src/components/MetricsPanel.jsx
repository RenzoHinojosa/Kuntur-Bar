import { Activity, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resetCommits, summarize } from '../utils/profilerStore.js';

/**
 * PASO 1 / PASO 4 · Panel de métricas del <Profiler>.
 * Vive FUERA del <Profiler> de main.jsx para no contaminar sus propias mediciones.
 * Prueba: escribe en el formulario de reservas y observa que los commits de "Carta" NO suben.
 */
export default function MetricsPanel() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!open) return undefined;
    const leer = () => setRows(summarize());
    leer();
    const id = setInterval(leer, 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) {
    return (
      <button type="button" className="metricas__fab" onClick={() => setOpen(true)} aria-label="Abrir métricas del Profiler" title="Métricas (Profiler)">
        <Activity size={20} />
      </button>
    );
  }

  return (
    <aside className="metricas" aria-label="Métricas del Profiler">
      <header>
        <strong><Activity size={16} aria-hidden="true" /> Profiler</strong>
        <span>
          <button type="button" onClick={() => { resetCommits(); setRows([]); }} aria-label="Reiniciar métricas" title="Reiniciar">
            <RotateCcw size={15} />
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar métricas">
            <X size={16} />
          </button>
        </span>
      </header>
      <table>
        <thead>
          <tr><th>Árbol</th><th>Commits</th><th>Mount</th><th>Update</th><th>Prom. ms</th><th>Máx. ms</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan="6">Sin datos todavía</td></tr>}
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.commits}</td><td>{r.mounts}</td><td>{r.updates}</td>
              <td>{r.avg.toFixed(2)}</td><td>{r.max.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small>Solo mide en <code>npm run dev</code>. Compáralo con la pestaña Profiler de React DevTools.</small>
    </aside>
  );
}
