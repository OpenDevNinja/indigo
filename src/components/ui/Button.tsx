import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-2 focus:ring-secondary-light',
    outline: 'border border-primary text-primary hover:bg-primary-light hover:text-white',
    ghost: 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
  };

  return (
    <button
      className={`
        btn 
        ${variantClasses[variant]} 
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        flex items-center justify-center space-x-2
      `}
      disabled={loading}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {loading ? (
        <span className="animate-spin">○</span>
      ) : (
        children
      )}
    </button>
  );
}