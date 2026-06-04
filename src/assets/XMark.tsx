interface XMarkProps {
  className?: string;
  size?: number;
}

export function XMark({ className = '', size }: XMarkProps) {
  const sizeAttr = size ? { width: size, height: size } : {};
  return (
    <svg
      className={`mark mark--x${className ? ` ${className}` : ''}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      {...sizeAttr}
    >
      <path
        className="mark__path mark__path--x1"
        d="M 8.5,8.5 C 11,11.5 15,15.5 20,20 C 25,24.5 29,28.5 31.5,31.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength="1"
      />
      <path
        className="mark__path mark__path--x2"
        d="M 31.5,8.5 C 29,11 24.5,15.5 20,20 C 15.5,24.5 11,29 8.5,31.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}
