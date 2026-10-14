import { Clock, MapPin, Mountain } from 'lucide-react';
import Chakana from './Chakana.jsx';

export default function Footer() {
  return (
    <footer id="ubicacion" className="pie">
      <div className="textil" aria-hidden="true" />
      <div className="contenedor pie__grid">
        <div>
          <p className="marca marca--pie">
            <Chakana size={26} /> <span className="marca__texto">Kuntur</span>
          </p>
          <p>Coctelería andina. El cóndor mira todo desde arriba, nosotros solo servimos.</p>
        </div>
        <ul className="pie__datos">
          <li><MapPin size={18} aria-hidden="true" /> Huancayo, Junín · Perú</li>
          <li><Clock size={18} aria-hidden="true" /> Mar a dom · 6:00 pm – 12:00 am</li>
          <li><Mountain size={18} aria-hidden="true" /> 3 259 metros sobre el nivel del mar</li>
        </ul>
        <p className="pie__curso">
          Práctica Semana 07 · React Hooks
          <br />
          Desarrollo de Aplicaciones Web (IS093A) · UNCP
          <br />
          Hinojosa Yaranga, Renzo Sebastián
        </p>
      </div>
      <p className="pie__legal contenedor">
        Proyecto académico. Catálogo e imágenes: TheCocktailDB. Precios simulados. Beba con responsabilidad: solo mayores de 18.
      </p>
    </footer>
  );
}
