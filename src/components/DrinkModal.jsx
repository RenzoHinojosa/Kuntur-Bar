import { CircleAlert, GlassWater, Plus, Tag, Wine, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ingredientImg, imgUrl, lookupUrl, normalizeDetail } from '../api/cocktails.js';
import { useCartActions } from '../context/CartContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { soles } from '../utils/format.js';
import Dialog from './Dialog.jsx';

export default function DrinkModal({ id, onClose }) {
  return (
    <Dialog open={id !== null} onClose={onClose} label="Detalle del trago" className="dialogo--detalle">
      {id !== null && <DrinkDetail id={id} onClose={onClose} />}
    </Dialog>
  );
}

function DrinkDetail({ id, onClose }) {
  const { data, loading, error, refetch } = useFetch(lookupUrl(id));
  const { add } = useCartActions();
  const [added, setAdded] = useState(false);
  const drink = normalizeDetail(data);

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div className="detalle">
      <button type="button" className="dialogo__cerrar btn-icono" onClick={onClose} aria-label="Cerrar detalle">
        <X size={20} />
      </button>

      {loading && <div className="detalle__carga skeleton" aria-busy="true" />}

      {error && (
        <div className="estado" role="alert">
          <CircleAlert size={32} aria-hidden="true" />
          <p>No pudimos cargar este trago.</p>
          <button type="button" className="btn btn--primario" onClick={refetch}>Reintentar</button>
        </div>
      )}

      {!loading && !error && !drink && <p className="estado">Este trago ya no está en la carta.</p>}

      {drink && !loading && (
        <>
          <img className="detalle__foto" src={imgUrl(drink.thumb, 'large')} alt={drink.name} width="500" height="500" />
          <div className="detalle__info">
            <h2>{drink.name}</h2>
            <ul className="etiquetas">
              {drink.category && <li><Tag size={14} aria-hidden="true" /> {drink.category}</li>}
              {drink.glass && <li><GlassWater size={14} aria-hidden="true" /> {drink.glass}</li>}
              {drink.alcohol && <li><Wine size={14} aria-hidden="true" /> {drink.alcohol}</li>}
            </ul>

            <h3>Ingredientes</h3>
            <ul className="ingredientes">
              {drink.ingredients.map((ing) => (
                <li key={ing.name}>
                  <img src={ingredientImg(ing.name)} alt="" width="40" height="40" loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
                  <span>
                    <strong>{ing.name}</strong>
                    {ing.measure && <small>{ing.measure}</small>}
                  </span>
                </li>
              ))}
            </ul>

            {drink.instructions && (
              <>
                <h3>Preparación</h3>
                <p className="detalle__pasos">{drink.instructions}</p>
              </>
            )}

            <div className="detalle__pie">
              <span className="precio precio--grande">{soles(drink.price)}</span>
              <button
                type="button"
                className="btn btn--primario"
                onClick={() => {
                  add(drink);
                  setAdded(true);
                }}
              >
                <Plus size={18} aria-hidden="true" /> {added ? '¡Agregado!' : 'Agregar al pedido'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
