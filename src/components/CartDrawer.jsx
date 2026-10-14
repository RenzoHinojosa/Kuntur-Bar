import { CheckCircle2, Minus, Plus, ShoppingBasket, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { imgUrl } from '../api/cocktails.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart, useCartActions } from '../context/CartContext.jsx';
import { soles } from '../utils/format.js';
import Dialog from './Dialog.jsx';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useCart();
  return (
    <Dialog open={cartOpen} onClose={closeCart} label="Tu pedido" className="dialogo--cajon">
      <CartPanel />
    </Dialog>
  );
}

function CartPanel() {
  const { items, total, count, closeCart } = useCart();
  const { inc, dec, remove, clear } = useCartActions();
  const { user, openLogin } = useAuth();
  const [pedido, setPedido] = useState(null); // código del pedido confirmado

  const finalizar = () => {
    if (!user) {
      closeCart();
      openLogin(); // para finalizar hay que tener sesión
      return;
    }
    const codigo = `KNT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    clear();
    setPedido(codigo);
  };

  return (
    <div className="cajon">
      <header className="cajon__cabeza">
        <h2>
          <ShoppingBasket size={22} aria-hidden="true" /> Tu pedido
        </h2>
        <button type="button" className="btn-icono" onClick={closeCart} aria-label="Cerrar pedido">
          <X size={20} />
        </button>
      </header>

      {pedido ? (
        <div className="estado estado--ok">
          <CheckCircle2 size={44} aria-hidden="true" />
          <h3>¡Pedido en barra!</h3>
          <p>
            Código <strong>{pedido}</strong>. Los tragos de {user?.nombre.split(' ')[0]} ya se están preparando.
          </p>
          <button type="button" className="btn btn--primario" onClick={closeCart}>
            Seguir mirando la carta
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="estado">
          <ShoppingBasket size={40} aria-hidden="true" />
          <h3>Tu pedido está vacío</h3>
          <p>Agrega algún trago de la carta con el botón +.</p>
          <button type="button" className="btn btn--contorno" onClick={closeCart}>
            Ir a la carta
          </button>
        </div>
      ) : (
        <>
          <ul className="cajon__lista">
            {items.map((it) => (
              <li key={it.id} className="linea">
                <img src={imgUrl(it.thumb, 'small')} alt="" width="56" height="56" />
                <div className="linea__info">
                  <strong>{it.name}</strong>
                  <span>{soles(it.price)}</span>
                </div>
                <div className="cantidad" role="group" aria-label={`Cantidad de ${it.name}`}>
                  <button type="button" onClick={() => dec(it.id)} aria-label="Quitar uno">
                    <Minus size={16} />
                  </button>
                  <output aria-live="polite">{it.qty}</output>
                  <button type="button" onClick={() => inc(it.id)} aria-label="Agregar uno">
                    <Plus size={16} />
                  </button>
                </div>
                <button type="button" className="linea__borrar" onClick={() => remove(it.id)} aria-label={`Eliminar ${it.name}`}>
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
          <footer className="cajon__pie">
            <div className="total">
              <span>{count} {count === 1 ? 'trago' : 'tragos'}</span>
              <strong>{soles(total)}</strong>
            </div>
            <button type="button" className="btn btn--primario btn--ancho" onClick={finalizar}>
              {user ? 'Finalizar pedido' : 'Ingresar para finalizar'}
            </button>
            <button type="button" className="btn btn--texto" onClick={clear}>
              <Trash2 size={16} aria-hidden="true" /> Vaciar pedido
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
