interface OMarkProps {
  className?: string;
  size?: number;
}

export function OMark({ className = '', size }: OMarkProps) {
  const sizeAttr = size ? { width: size, height: size } : {};
  return (
    <svg
      className={`mark mark--o${className ? ` ${className}` : ''}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      {...sizeAttr}
    >
      <path
        className="mark__path mark__path--o"
        d="M 20,7.5 C 28.8,7.5 32.5,13.2 32.5,20 C 32.5,26.8 26.8,32.5 20,32.5 C 13.2,32.5 7.5,26.8 7.5,20 C 7.5,13.2 11.5,7.5 20,8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}
