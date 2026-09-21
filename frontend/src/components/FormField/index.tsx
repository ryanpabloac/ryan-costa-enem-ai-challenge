import type { InputHTMLAttributes, ReactNode } from 'react';
import './style.css';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: string;
  rightElement?: ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  id,
  name,
  className = '',
  rightElement,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      <div className="form-field__header">
        <label htmlFor={fieldId} className="form-field__label">
          {label}
          {inputProps.required && <span className="form-field__required" aria-hidden="true"> *</span>}
        </label>
        {rightElement && <div className="form-field__right-action">{rightElement}</div>}
      </div>

      <div className="form-field__input-wrapper">
        <input
          id={fieldId}
          name={name}
          className="form-field__input"
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          {...inputProps}
        />
      </div>

      {hint && !error && (
        <span id={`${fieldId}-hint`} className="form-field__hint">
          {hint}
        </span>
      )}

      {error && (
        <span id={`${fieldId}-error`} className="form-field__error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
