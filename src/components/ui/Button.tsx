import React, { ButtonHTMLAttributes } from 'react';

// Définition des types de variantes et de tailles
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// Interface étendue des props du bouton
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: ButtonSize; // Ajout de la prop de taille
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  icon,
  size = 'md', // Taille par défaut
  className = '',
  ...props
}: ButtonProps) {
  // Classes de variantes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-2 focus:ring-secondary-light',
    outline: 'border border-primary text-primary hover:bg-primary-light hover:text-white',
    ghost: 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
  };

  // Classes de tailles
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs', // Petit
    md: 'px-4 py-2 text-sm', // Moyen (défaut)
    lg: 'px-6 py-3 text-base'  // Grand
  };

  return (
    <button
      className={`
        btn 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} // Ajout des classes de taille
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