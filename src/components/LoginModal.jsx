import { Eye, EyeOff, LockKeyhole, Mail, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { fuerzaPassword, reglasLogin } from '../utils/validators.js';
import Chakana from './Chakana.jsx';
import Dialog from './Dialog.jsx';
import { Field } from './Field.jsx';

const INICIAL = { email: '', password: '' };
const NIVELES = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'];

export default function LoginModal() {
  const { loginOpen, closeLogin } = useAuth();
  return (
    <Dialog open={loginOpen} onClose={closeLogin} label="Ingresar a Kuntur" className="dialogo--login">
      <LoginForm />
    </Dialog>
  );
}

function LoginForm() {
  const { login, closeLogin } = useAuth();
  const form = useForm({ initialValues: INICIAL, rules: reglasLogin });
  const [ver, setVer] = useState(false);
  const fuerza = fuerzaPassword(form.values.password);

  const onSubmit = form.submit(
    (v) => login(v.email),
    (names) => document.getElementsByName(names[0])[0]?.focus(),
  );

  return (
    <form className="login" onSubmit={onSubmit} noValidate>
      <button type="button" className="dialogo__cerrar btn-icono" onClick={closeLogin} aria-label="Cerrar">
        <X size={20} />
      </button>
      <Chakana size={40} className="login__chakana" />
      <h2>Entra a la barra</h2>
      <p className="login__sub">Con tu sesión puedes finalizar pedidos y reservar sin repetir datos.</p>

      <Field form={form} name="email" label="Correo" icon={Mail} type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" />

      <Field
        form={form}
        name="password"
        label="Contraseña"
        icon={LockKeyhole}
        type={ver ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="Mín. 8 caracteres, 1 mayúscula y 1 número"
        adornment={
          <button type="button" className="campo__ojo" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {ver ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      {form.values.password && (
        <div className="fuerza" aria-live="polite">
          <div className={`fuerza__barra fuerza--${fuerza}`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={i < fuerza ? 'on' : ''} />
            ))}
          </div>
          <small>Seguridad: {NIVELES[fuerza]}</small>
        </div>
      )}

      <button type="submit" className="btn btn--primario btn--ancho">
        Ingresar
      </button>
      <p className="login__nota">Demo académica: tus datos no se envían a ningún servidor.</p>
    </form>
  );
}
