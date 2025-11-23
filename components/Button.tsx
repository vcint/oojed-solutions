"use client";
import Link from 'next/link';
import { ComponentProps } from 'react';

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient' | 'surface';
  className?: string;
  title?: string;
} & ComponentProps<'button'>;

export default function Button({ href, onClick, children, variant = 'primary', className = '', title, ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-200 px-4 py-2 md:px-5 md:py-2.5 focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  const variants: Record<string, string> = {
    primary:
      'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 focus-visible:ring-ring/30',
    outline:
      'bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/30',
    ghost:
      'bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/30',
    gradient:
      'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground border-transparent shadow-lg shadow-primary/25 hover:opacity-90 focus-visible:ring-ring/30',
    surface:
      'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 focus-visible:ring-ring/30',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} title={title} {...(rest as any)} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} title={title} {...rest}>
      {children}
    </button>
  );
}
