import { memo, useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { imgUrl } from '../api/cocktails.js';
import { soles } from '../utils/format.js';

/**
 * PASO 4 · React.memo: la tarjeta solo se re-renderiza si cambian SUS props.
 * `onOpen` y `onAdd` llegan estabilizados con useCallback desde Menu.
 */
function DrinkCard({ drink, onOpen, onAdd }) {
  const [added, setAdded] = useState(false);

  // Feedback visual de 1.2 s; el cleanup evita setState en un componente desmontado
  useEffect(() => {
    if (!added) return undefined;
    const id = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(id);
  }, [added]);

  const handleAdd = () => {
    onAdd(drink);
    setAdded(true);
  };

  const handleImgError = (e) => {
    const img = e.currentTarget;
    if (img.dataset.fallback !== '1') {
      img.dataset.fallback = '1';
      img.src = drink.thumb; // tamaño original si /medium falla
    }
  };

  return (
    <article className="tarjeta">
      <button type="button" className="tarjeta__foto" onClick={() => onOpen(drink.id)} aria-label={`Ver detalle de ${drink.name}`}>
        <img src={imgUrl(drink.thumb)} alt="" width="350" height="350" loading="lazy" onError={handleImgError} />
      </button>
      <div className="tarjeta__cuerpo">
        <h3 title={drink.name}>{drink.name}</h3>
        <div className="tarjeta__pie">
          <span className="precio">{soles(drink.price)}</span>
          <button
            type="button"
            className={`btn-icono btn-icono--lleno ${added ? 'btn-icono--ok' : ''}`}
            onClick={handleAdd}
            aria-label={`Agregar ${drink.name} al pedido`}
          >
            {added ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(DrinkCard);
