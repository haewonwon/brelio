import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-pill bg-brelio-primary px-5 py-2.5 text-sm font-semibold text-white shadow-button transition-colors hover:bg-brelio-primary-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brelio-secondary ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
