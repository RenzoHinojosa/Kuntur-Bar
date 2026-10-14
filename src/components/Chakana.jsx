// Chakana (cruz andina escalonada) dibujada a mano como SVG: es la identidad visual de Kuntur.
export default function Chakana({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M40 0H60V20H80V40H100V60H80V80H60V100H40V80H20V60H0V40H20V20H40Z M60 50a10 10 0 1 1-20 0a10 10 0 1 1 20 0Z"
      />
    </svg>
  );
}
