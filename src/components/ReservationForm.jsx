import { CalendarDays, CheckCircle2, Clock, IdCard, Mail, MessageSquareText, PartyPopper, Phone, Ticket, User, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { HORAS, OCASIONES, masksReserva, maxDateISO, reglasReserva, todayISO } from '../utils/validators.js';
import { CheckField, Field } from './Field.jsx';

const INICIAL = {
  nombre: '', dni: '', celular: '', email: '', fecha: '', hora: '',
  personas: '2', ocasion: OCASIONES[0], notas: '', terminos: false,
};

export default function ReservationForm() {
  const { user } = useAuth();
  const formRef = useRef(null);
  const [ticket, setTicket] = useState(null);
  const form = useForm({ initialValues: INICIAL, rules: reglasReserva, masks: masksReserva });
  const { fillEmpty, reset } = form;

  // Si hay sesión, precarga nombre y correo (solo en campos vacíos)
  useEffect(() => {
    if (user) fillEmpty({ nombre: user.nombre, email: user.email });
  }, [user, fillEmpty]);

  const onSubmit = form.submit(
    (v) => {
      const codigo = `RES-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      setTicket({ ...v, codigo });
    },
    // Formulario inválido: llevamos el foco al primer campo con error
    (names) => formRef.current?.elements[names[0]]?.focus(),
  );

  const nuevaReserva = () => {
    setTicket(null);
    reset();
  };

  return (
    <section id="reservas" className="seccion contenedor reservas" aria-labelledby="reservas-titulo">
      <div className="reservas__lado">
        <h2 id="reservas-titulo">Reserva tu mesa</h2>
        <p>
          Cuéntanos cuándo vienes y te guardamos sitio. Cada campo se valida mientras escribes, así no
          pierdes tiempo corrigiendo al final.
        </p>
        <ul className="reglas">
          <li><Clock size={18} aria-hidden="true" /> Mar a dom, 6:00 pm a 12:00 am</li>
          <li><CalendarDays size={18} aria-hidden="true" /> Lunes cerrado (la barra descansa)</li>
          <li><Users size={18} aria-hidden="true" /> Grupos de 1 a 12 personas</li>
          <li><PartyPopper size={18} aria-hidden="true" /> Cuéntanos si es una ocasión especial</li>
        </ul>
      </div>

      {ticket ? (
        <div className="ticket" role="status">
          <div className="ticket__cabeza">
            <CheckCircle2 size={28} aria-hidden="true" />
            <div>
              <h3>¡Mesa guardada!</h3>
              <p>Te escribiremos a {ticket.email}</p>
            </div>
          </div>
          <dl className="ticket__datos">
            <div><dt>A nombre de</dt><dd>{ticket.nombre}</dd></div>
            <div><dt>Fecha</dt><dd>{ticket.fecha}</dd></div>
            <div><dt>Hora</dt><dd>{ticket.hora}</dd></div>
            <div><dt>Personas</dt><dd>{ticket.personas}</dd></div>
            <div><dt>Ocasión</dt><dd>{ticket.ocasion}</dd></div>
            <div><dt>Celular</dt><dd>{ticket.celular}</dd></div>
          </dl>
          <div className="ticket__codigo">
            <Ticket size={20} aria-hidden="true" />
            <span>{ticket.codigo}</span>
          </div>
          <button type="button" className="btn btn--contorno" onClick={nuevaReserva}>
            Hacer otra reserva
          </button>
        </div>
      ) : (
        <form ref={formRef} className="formulario" onSubmit={onSubmit} noValidate>
          <div className="formulario__fila">
            <Field form={form} name="nombre" label="Nombre y apellido" icon={User} autoComplete="name" placeholder="Ej. Renzo Hinojosa" />
            <Field form={form} name="dni" label="DNI" icon={IdCard} inputMode="numeric" autoComplete="off" placeholder="8 dígitos" hint="Solo números" />
          </div>
          <div className="formulario__fila">
            <Field form={form} name="celular" label="Celular" icon={Phone} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="9XXXXXXXX" />
            <Field form={form} name="email" label="Correo" icon={Mail} type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" />
          </div>
          <div className="formulario__fila formulario__fila--3">
            <Field form={form} name="fecha" label="Fecha" icon={CalendarDays} type="date" min={todayISO()} max={maxDateISO()} />
            <Field form={form} name="hora" label="Hora" icon={Clock} as="select">
              <option value="">Elige…</option>
              {HORAS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Field>
            <Field form={form} name="personas" label="Personas" icon={Users} type="number" min="1" max="12" inputMode="numeric" />
          </div>
          <Field form={form} name="ocasion" label="Ocasión" icon={PartyPopper} as="select">
            {OCASIONES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </Field>
          <Field form={form} name="notas" label="Comentarios (opcional)" icon={MessageSquareText} as="textarea" rows="3" counter={140} placeholder="Alergias, mesa cerca de la ventana, torta sorpresa…" />
          <CheckField form={form} name="terminos">
            Acepto que me contacten para confirmar mi reserva y que la mesa se guarda 15 minutos.
          </CheckField>
          <button type="submit" className="btn btn--primario btn--ancho">
            <Ticket size={18} aria-hidden="true" /> Confirmar reserva
          </button>
        </form>
      )}
    </section>
  );
}
