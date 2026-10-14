import { LogOut, Moon, ShoppingBasket, Sun, User } from 'lucide-react';
import Chakana from './Chakana.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { user, logout, openLogin } = useAuth();
  const { count, openCart } = useCart();

  return (
    <header className="cabecera">
      <div className="textil" aria-hidden="true" />
      <div className="cabecera__fila contenedor">
        <a href="#inicio" className="marca" aria-label="Kuntur, ir al inicio">
          <Chakana size={30} className="marca__icono" />
          <span className="marca__texto">Kuntur</span>
        </a>

        <nav className="menu" aria-label="Principal">
          <a href="#carta">Carta</a>
          <a href="#reservas">Reservas</a>
          <a href="#ubicacion">Visítanos</a>
        </nav>

        <div className="acciones">
          <button
            type="button"
            className="btn-icono"
            onClick={toggle}
            aria-label={theme === 'noche' ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
            title={theme === 'noche' ? 'Modo día' : 'Modo noche'}
          >
            {theme === 'noche' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <button type="button" className="chip-usuario" onClick={logout} title="Cerrar sesión">
              <span className="chip-usuario__inicial" aria-hidden="true">
                {user.nombre.charAt(0)}
              </span>
              <span className="chip-usuario__nombre">{user.nombre.split(' ')[0]}</span>
              <LogOut size={16} aria-hidden="true" />
              <span className="sr-only">Cerrar sesión</span>
            </button>
          ) : (
            <button type="button" className="btn btn--suave" onClick={openLogin}>
              <User size={18} aria-hidden="true" />
              <span className="solo-desktop">Ingresar</span>
              <span className="sr-only solo-movil">Ingresar</span>
            </button>
          )}

          <button type="button" className="btn-icono btn-icono--carrito" onClick={openCart} aria-label={`Abrir pedido, ${count} tragos`}>
            <ShoppingBasket size={20} />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
