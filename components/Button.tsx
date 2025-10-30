"use client";
import Link from 'next/link';
import { ComponentProps } from 'react';

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
} & ComponentProps<'button'>;

export default function Button({ href, onClick, children, variant = 'primary', className = '', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold shadow-sm px-4 py-2 focus:outline-none focus:ring-4';
  const variants: Record<string, string> = {
    primary: 'bg-[#102a6d] text-white border-transparent hover:bg-[#0b3ea0] focus:ring-blue-200',
    outline: 'bg-white text-[#102a6d] border-2 border-[#102a6d] hover:shadow-md focus:ring-blue-100',
    ghost: 'bg-transparent text-[#102a6d] hover:bg-white/5 focus:ring-blue-100',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as any)} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} {...rest}>
      {children}
    </button>
  );
}
