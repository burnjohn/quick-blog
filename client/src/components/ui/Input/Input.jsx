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
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`

  return (
    <div className={classNames('w-full', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className='block mb-2 text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        type={type}
        required={required}
        className={classNames(
          'w-full px-4 py-2.5 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-4 transition-colors duration-200',
          error 
            ? 'border-destructive focus:ring-destructive/30'
            : 'border-input focus:border-accent focus:ring-accent/40',
          className
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role='alert' className='mt-1 text-sm text-destructive'>{error}</p>
      )}
    </div>
  )
}

export default Input

