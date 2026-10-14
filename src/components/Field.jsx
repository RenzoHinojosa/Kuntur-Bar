import { useId } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';

/**
 * Campo de formulario con validación VISUAL en tiempo real.
 * Recibe el objeto `form` de useForm y el `name` del campo.
 */
export function Field({ label, icon: Icon, form, name, as = 'input', hint, counter, adornment, children, ...rest }) {
  const id = useId();
  const msgId = `${id}-msg`;
  const { error, valid } = form.status(name);
  const Control = as;

  return (
    <div className={`campo ${error ? 'campo--error' : ''} ${valid ? 'campo--ok' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className={`campo__control ${as === 'textarea' ? 'campo__control--area' : ''}`}>
        {Icon && <Icon className="campo__icono" size={18} aria-hidden="true" />}
        <Control
          id={id}
          {...form.fieldProps(name)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={msgId}
          {...rest}
        >
          {children}
        </Control>
        {adornment}
        {error && <CircleAlert className="campo__estado" size={18} aria-hidden="true" />}
        {valid && <CircleCheck className="campo__estado" size={18} aria-hidden="true" />}
      </div>
      <p id={msgId} className="campo__msg" aria-live="polite">
        <span>{error || hint || '\u00A0'}</span>
        {counter && (
          <span className="campo__contador">
            {form.values[name].length}/{counter}
          </span>
        )}
      </p>
    </div>
  );
}

export function CheckField({ form, name, children }) {
  const id = useId();
  const msgId = `${id}-msg`;
  const { error, valid } = form.status(name);

  return (
    <div className={`campo campo--check ${error ? 'campo--error' : ''} ${valid ? 'campo--ok' : ''}`}>
      <label className="check" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={form.values[name]}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={msgId}
        />
        <span className="check__caja" aria-hidden="true" />
        <span>{children}</span>
      </label>
      <p id={msgId} className="campo__msg" aria-live="polite">
        <span>{error || '\u00A0'}</span>
      </p>
    </div>
  );
}
