import React, { useId } from 'react'
import { classNames } from '../../../utils/helpers'

function Textarea({
  label,
  error,
  className = '',
  containerClassName = '',
  rows = 4,
  required = false,
  id,
  ...props
}) {
  const generatedId = useId()
  const textareaId = id || generatedId
  const errorId = `${textareaId}-error`

  return (
    <div className={classNames('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className='block mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink'
        >
          {label}
          {required && <span className='text-danger ml-1' aria-hidden='true'>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={classNames(
          'w-full p-4 bg-surface border text-base text-ink placeholder:text-ink-muted outline-none transition-colors resize-none',
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

export default Textarea
