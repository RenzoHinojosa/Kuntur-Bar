import { Dices, Mountain, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { RANDOM_URL, imgUrl, normalizeList } from '../api/cocktails.js';
import { useCartActions } from '../context/CartContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { soles } from '../utils/format.js';

export default function Hero({ onOpen }) {
  // Segundo uso de useFetch: "Sorpresa de la barra" (trago aleatorio). refetch() pide otro.
  const { data, loading, error, refetch } = useFetch(RANDOM_URL);
  const { add } = useCartActions();
  const [flash, setFlash] = useState(false);
  const drink = normalizeList(data)[0];

  const handleAdd = () => {
    add(drink);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  return (
    <section id="inicio" className="hero contenedor">
      <div className="hero__texto">
        <p className="hero__kicker">
          <Mountain size={16} aria-hidden="true" /> Coctelería andina · Huancayo · 3 259 msnm
        </p>
        <h1>
          Tragos con <span className="subrayado">altura.</span>
        </h1>
        <p className="hero__bajada">
          Allá arriba el pisco se siente distinto. Elige de una carta enorme, arma tu pedido desde aquí y
          reserva tu mesa al toque. <span className="mano">¡Salud, causa!</span>
        </p>
        <div className="hero__cta">
          <a className="btn btn--primario" href="#carta">
            Ver la carta
          </a>
          <a className="btn btn--contorno" href="#reservas">
            Reservar mesa
          </a>
        </div>
        <p className="sticker-lunes">Lunes cerrado: la barra también descansa.</p>
      </div>

      <aside className="sorpresa" aria-label="Sorpresa de la barra">
        <div className="sorpresa__cinta">
          <Sparkles size={16} aria-hidden="true" /> Sorpresa de la barra
        </div>
        {loading && <div className="sorpresa__foto skeleton" aria-busy="true" />}
        {error && <p className="sorpresa__error">No pudimos traer el trago. Revisa tu conexión.</p>}
        {drink && !loading && (
          <>
            <button type="button" className="sorpresa__foto" onClick={() => onOpen(drink.id)} aria-label={`Ver detalle de ${drink.name}`}>
              <img src={imgUrl(drink.thumb, 'large')} alt={drink.name} width="500" height="500" />
            </button>
            <div className="sorpresa__pie">
              <div>
                <h2>{drink.name}</h2>
                <p>{soles(drink.price)}</p>
              </div>
              <button type="button" className="btn-icono btn-icono--lleno" onClick={handleAdd} aria-label={`Agregar ${drink.name} al pedido`}>
                <Plus size={20} />
              </button>
            </div>
            {flash && <p className="sorpresa__ok" role="status">¡Anotado en tu pedido!</p>}
          </>
        )}
        <button type="button" className="btn btn--suave sorpresa__otro" onClick={refetch} disabled={loading}>
          <Dices size={18} aria-hidden="true" /> Sorpréndeme otra vez
        </button>
      </aside>
    </section>
  );
}
