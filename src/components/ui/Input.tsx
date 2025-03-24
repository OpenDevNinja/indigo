import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

interface StandardInputProps extends BaseInputProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
}

interface SelectInputProps extends BaseInputProps, SelectHTMLAttributes<HTMLSelectElement> {
  type: 'select';
  options: { value: string; label: string }[];
}

type InputProps = StandardInputProps | SelectInputProps;

export default function Input(props: InputProps) {
  const { 
    label, 
    error, 
    icon, 
    className = '', 
    ...rest 
  } = props;

  const baseClasses = `
    form-input 
    w-full 
    rounded-md 
    border 
    border-neutral-300 
    dark:border-neutral-600 
    dark:bg-neutral-800 
    dark:text-white 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-blue-500
  `;

  const renderInput = () => {
    if (props.type === 'select') {
      return (
        <select
          className={`
            ${baseClasses}
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...rest as SelectHTMLAttributes<HTMLSelectElement>}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        className={`
          ${baseClasses}
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...rest as InputHTMLAttributes<HTMLInputElement>}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          htmlFor={rest.id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {renderInput()}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}