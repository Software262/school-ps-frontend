import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({ className = '', label, error, ref, ...props }) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input ref={ref} className={`input-field ${className}`} {...props} />
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};
