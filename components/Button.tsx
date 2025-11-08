"use client";
import Link from 'next/link';
import { ComponentProps } from 'react';

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient' | 'surface';
  className?: string;
} & ComponentProps<'button'>;

export default function Button({ href, onClick, children, variant = 'primary', className = '', ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-200 px-4 py-2 focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0';
  const variants: Record<string, string> = {
    primary:
      'bg-[#0f2c73] text-white border-transparent shadow-[0_14px_40px_rgba(16,42,109,0.32)] hover:bg-[#0b3ea0] focus-visible:ring-blue-200/60 dark:bg-[#123676] dark:hover:bg-[#0f4cb0] dark:focus-visible:ring-[#5ea8ff]/40',
    outline:
      'bg-white/95 text-slate-900 border border-slate-200/70 hover:bg-white focus-visible:ring-[#0f3fa6]/25 dark:bg-transparent dark:text-slate-100 dark:border-white/35 dark:hover:bg-white/10 dark:focus-visible:ring-white/30',
    ghost:
      'bg-transparent text-[#102a6d] border-transparent hover:bg-[#102a6d]/10 focus-visible:ring-[#102a6d]/25 dark:text-slate-100 dark:hover:bg-white/10 dark:focus-visible:ring-white/25',
    gradient:
      'bg-gradient-to-r from-[#1b3f92] via-[#0f5bd8] to-[#00a8ff] text-white border-transparent shadow-[0_18px_55px_rgba(15,91,216,0.4)] hover:opacity-95 focus-visible:ring-[#5ea8ff]/40',
    surface:
      'bg-white/85 text-slate-900 border border-white/70 shadow-[0_20px_50px_rgba(9,18,44,0.15)] hover:bg-white focus-visible:ring-[#0f3fa6]/20 dark:bg-white/10 dark:text-white dark:border-white/25 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:bg-white/15 dark:focus-visible:ring-white/30',
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
