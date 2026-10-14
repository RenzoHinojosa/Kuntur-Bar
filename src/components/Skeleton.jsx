export default function Skeleton({ count = 8 }) {
  return (
    <div className="grilla" aria-busy="true" aria-label="Cargando tragos">
      {Array.from({ length: count }, (_, i) => (
        <div className="tarjeta tarjeta--sk" key={i}>
          <div className="skeleton tarjeta__foto" />
          <div className="tarjeta__cuerpo">
            <div className="skeleton sk-linea" />
            <div className="skeleton sk-linea sk-linea--corta" />
          </div>
        </div>
      ))}
    </div>
  );
}
