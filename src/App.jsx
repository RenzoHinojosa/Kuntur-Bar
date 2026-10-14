import { useCallback, useState } from 'react';
import CartDrawer from './components/CartDrawer.jsx';
import DrinkModal from './components/DrinkModal.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import LoginModal from './components/LoginModal.jsx';
import Menu from './components/Menu.jsx';
import ReservationForm from './components/ReservationForm.jsx';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  // useCallback: referencia estable para que React.memo(DrinkCard) sirva de algo
  const openDrink = useCallback((id) => setSelectedId(id), []);
  const closeDrink = useCallback(() => setSelectedId(null), []);

  return (
    <>
      <a className="saltar" href="#carta">Saltar al contenido</a>
      <Header />
      <main>
        <Hero onOpen={openDrink} />
        <Menu onOpen={openDrink} />
        <ReservationForm />
      </main>
      <Footer />

      <DrinkModal id={selectedId} onClose={closeDrink} />
      <CartDrawer />
      <LoginModal />
    </>
  );
}
