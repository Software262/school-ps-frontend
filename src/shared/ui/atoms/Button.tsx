import type { ButtonHTMLAttributes, Ref } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export const Button = ({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  ref,
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={ref}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={fullWidth ? { width: '100%' } : {}}
      {...props}
    >
      {children}
    </button>
  );
};
