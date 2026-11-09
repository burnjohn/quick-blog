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
  const fieldId = id ?? generatedId

  return (
    <div className={classNames('w-full', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className='block mb-2 font-mono text-xs uppercase tracking-[0.14em] text-muted'>
          {label}
          {required && <span className='text-lime ml-1'>*</span>}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        required={required}
        className={classNames(
          'w-full px-4 py-3 rounded-xl border bg-white/[0.04] text-ink outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lime/70 disabled:opacity-50 disabled:cursor-not-allowed',
          error 
            ? 'border-rose-400/60 focus:border-rose-400' 
            : 'border-white/10 hover:border-white/20 focus:border-primary focus:bg-white/[0.06]',
          className
        )}
        {...props}
      />
      {error && (
        <p className='mt-1.5 text-sm text-rose-300'>{error}</p>
      )}
    </div>
  )
}

export default Input

