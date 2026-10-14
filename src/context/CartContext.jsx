import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

// PASO 3 + useReducer · Carrito.
// Se separa en DOS contextos para no re-renderizar de más:
//   - CartStateContext   -> datos que cambian (items, total...)  : Header, CartDrawer
//   - CartActionsContext -> funciones estables (add, inc...)     : la Carta (no se re-renderiza al agregar)

const CartStateContext = createContext(null);
const CartActionsContext = createContext(null);

const MAX_QTY = 20;
const STORAGE_KEY = 'kuntur-carrito';

function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const { item } = action;
      const found = items.find((i) => i.id === item.id);
      if (!found) return [...items, { id: item.id, name: item.name, thumb: item.thumb, price: item.price, qty: 1 }];
      return items.map((i) => (i.id === item.id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i));
    }
    case 'inc':
      return items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i));
    case 'dec':
      return items.flatMap((i) => {
        if (i.id !== action.id) return [i];
        return i.qty <= 1 ? [] : [{ ...i, qty: i.qty - 1 }];
      });
    case 'remove':
      return items.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      throw new Error(`Acción de carrito desconocida: ${action.type}`);
  }
}

// Inicializador perezoso: lee el carrito guardado solo en el primer render
function initCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], initCart);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* sin persistencia */
    }
  }, [items]);

  // `dispatch` es estable => las acciones se crean una sola vez
  const actions = useMemo(
    () => ({
      add: (item) => dispatch({ type: 'add', item }),
      inc: (id) => dispatch({ type: 'inc', id }),
      dec: (id) => dispatch({ type: 'dec', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [],
  );

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    [items],
  );

  const state = useMemo(
    () => ({ items, count, total, cartOpen, openCart, closeCart }),
    [items, count, total, cartOpen, openCart, closeCart],
  );

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}

export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error('useCartActions debe usarse dentro de <CartProvider>');
  return ctx;
}
