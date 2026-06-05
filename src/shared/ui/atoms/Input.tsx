import type { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ className = '', label, error, ref, ...props }: InputProps) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input ref={ref} className={`input-field ${className}`} {...props} />
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};
