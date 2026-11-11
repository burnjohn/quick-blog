import React, { useId } from 'react'
import { classNames } from '../../../utils/helpers'

function Input({
  label,
  error,
  className = '',
  containerClassName = '',
  type = 'text',
  required = false,
  id,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = `${inputId}-error`

  return (
    <div className={classNames('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className='block mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink'
        >
          {label}
          {required && <span className='text-danger ml-1' aria-hidden='true'>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={classNames(
          'w-full min-h-12 px-4 bg-surface border text-base text-ink placeholder:text-ink-muted/70 outline-none transition-colors',
          error
            ? 'border-danger focus:border-danger'
            : 'border-line hover:border-ink focus:border-ink',
          className
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role='alert' className='mt-1.5 text-sm text-danger'>{error}</p>
      )}
    </div>
  )
}

export default Input
