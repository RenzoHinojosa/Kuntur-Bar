import { useCallback, useMemo, useState } from 'react';

/**
 * PASO 5 · Hook personalizado useForm (validación en tiempo real)
 *
 * rules : { campo: (valor, todosLosValores) => 'mensaje de error' | '' }
 * masks : { campo: (valorCrudo) => valorLimpio }   (p. ej. solo dígitos para el DNI)
 *
 * `rules` y `masks` deben definirse FUERA del componente para que su referencia sea estable.
 * Los errores se DERIVAN de los valores con useMemo (no se guardan en otro estado).
 */
export function useForm({ initialValues, rules, masks = {} }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({}); // el usuario salió del campo
  const [dirty, setDirty] = useState({}); // el usuario escribió en el campo

  const errors = useMemo(() => {
    const out = {};
    for (const name of Object.keys(rules)) {
      const msg = rules[name](values[name], values);
      if (msg) out[name] = msg;
    }
    return out;
  }, [rules, values]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback(
    (e) => {
      const { name, type, checked, value } = e.target;
      const raw = type === 'checkbox' ? checked : value;
      const next = masks[name] ? masks[name](raw) : raw;
      setValues((v) => ({ ...v, [name]: next }));
      setDirty((d) => (d[name] ? d : { ...d, [name]: true }));
    },
    [masks],
  );

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((t) => (t[name] ? t : { ...t, [name]: true }));
  }, []);

  /** Props listas para un <input>/<select>/<textarea>. */
  const fieldProps = useCallback(
    (name) => ({ name, value: values[name], onChange: handleChange, onBlur: handleBlur }),
    [values, handleChange, handleBlur],
  );

  /** Estado visual de un campo: el error solo se muestra si ya lo tocaron o escribieron. */
  const status = useCallback(
    (name) => {
      const shown = Boolean(touched[name] || dirty[name]);
      return { error: shown ? errors[name] || '' : '', valid: shown && !errors[name] };
    },
    [touched, dirty, errors],
  );

  const submit = useCallback(
    (onValid, onInvalid) => (e) => {
      e.preventDefault();
      setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])));
      if (isValid) onValid(values);
      else onInvalid?.(Object.keys(errors));
    },
    [rules, isValid, errors, values],
  );

  /** Rellena solo los campos vacíos (p. ej. con los datos de la sesión). */
  const fillEmpty = useCallback((partial) => {
    setValues((v) => {
      const next = { ...v };
      for (const [k, val] of Object.entries(partial)) if (!v[k]) next[k] = val;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setDirty({});
  }, [initialValues]);

  return { values, errors, isValid, fieldProps, status, handleChange, handleBlur, submit, fillEmpty, reset };
}
