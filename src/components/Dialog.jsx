import { useEffect, useRef } from 'react';

/**
 * Modal accesible basado en <dialog> nativo (focus trap, Esc y aria-modal gratis).
 * useRef -> acceso directo al nodo DOM para llamar showModal()/close() sin re-render.
 */
export default function Dialog({ open, onClose, label, className = '', children }) {
  const ref = useRef(null);

  // IA: el <dialog> se cerraba solo en StrictMode al usar close() dentro del cleanup → Solución manual:
  // sin cleanup; el efecto solo sincroniza `open` con el estado real del nodo (dlg.open) en cada cambio.
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  // El <dialog> no tiene padding: un clic directo sobre él es un clic en el fondo (backdrop)
  const handleClick = (e) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog ref={ref} className={`dialogo ${className}`} aria-label={label} onClose={onClose} onClick={handleClick}>
      {open ? children : null}
    </dialog>
  );
}
