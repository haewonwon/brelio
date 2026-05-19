import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-card border border-brelio-border bg-brelio-surface p-6 shadow-card sm:p-8 ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export default Card;
