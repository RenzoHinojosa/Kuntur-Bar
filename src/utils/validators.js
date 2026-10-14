// Reglas de validación puras (reutilizables por useForm). Devuelven '' si el valor es válido.

const NOMBRE_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'.\- ]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const maxDateISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return toISO(d);
};

export const HORAS = [
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00',
];

export const OCASIONES = ['Solo vamos a tomar', 'Cumpleaños', 'Aniversario', 'After office', 'Despedida', 'Otra'];

const email = (v) => {
  if (!v.trim()) return 'Necesitamos un correo para confirmarte.';
  if (!EMAIL_RE.test(v.trim())) return 'Ese correo no parece válido (ej. nombre@correo.com).';
  return '';
};

export const reglasReserva = {
  nombre: (v) => {
    const t = v.trim();
    if (!t) return 'Cuéntanos tu nombre.';
    if (!NOMBRE_RE.test(t)) return 'Solo letras y espacios, por favor.';
    if (t.length < 5 || t.split(/\s+/).length < 2) return 'Escribe nombre y apellido.';
    return '';
  },
  dni: (v) => {
    if (!v) return 'Falta tu DNI.';
    if (v.length < 8) return `Faltan ${8 - v.length} dígito(s): el DNI tiene 8.`;
    return '';
  },
  celular: (v) => {
    if (!v) return 'Déjanos un celular.';
    if (v[0] !== '9') return 'Los celulares en Perú empiezan con 9.';
    if (v.length < 9) return `Faltan ${9 - v.length} dígito(s): son 9.`;
    return '';
  },
  email,
  fecha: (v) => {
    if (!v) return 'Elige una fecha.';
    if (v < todayISO()) return 'Esa fecha ya pasó.';
    if (v > maxDateISO()) return 'Reservamos con máximo 60 días de anticipación.';
    const [y, m, d] = v.split('-').map(Number);
    if (new Date(y, m - 1, d).getDay() === 1) return 'Los lunes la barra descansa. Elige otro día.';
    return '';
  },
  hora: (v) => (HORAS.includes(v) ? '' : 'Elige una hora de la lista.'),
  personas: (v) => {
    if (v === '') return 'Indica cuántos van.';
    const n = Number(v);
    if (!Number.isInteger(n)) return 'Debe ser un número entero.';
    if (n < 1) return 'Mínimo 1 persona.';
    if (n > 12) return 'Para más de 12 escríbenos y lo coordinamos.';
    return '';
  },
  notas: (v) => (v.length > 140 ? `Te pasaste por ${v.length - 140} caracteres.` : ''),
  terminos: (v) => (v ? '' : 'Debes aceptar para continuar.'),
};

export const masksReserva = {
  dni: (v) => v.replace(/\D/g, '').slice(0, 8),
  celular: (v) => v.replace(/\D/g, '').slice(0, 9),
};

export const reglasLogin = {
  email,
  password: (v) => {
    if (!v) return 'Escribe tu contraseña.';
    if (v.length < 8) return `Mínimo 8 caracteres (llevas ${v.length}).`;
    if (!/[A-Z]/.test(v)) return 'Incluye al menos una mayúscula.';
    if (!/\d/.test(v)) return 'Incluye al menos un número.';
    return '';
  },
};

/** 0..4 para el medidor de contraseña */
export function fuerzaPassword(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  return s;
}
