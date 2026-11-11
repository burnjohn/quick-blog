import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  primary: 'bg-ink text-paper border border-ink hover:bg-signal hover:text-ink',
  accent: 'bg-signal text-ink border border-ink hover:bg-ink hover:text-signal',
  secondary: 'bg-surface text-ink border border-line hover:border-ink',
  outline: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper',
  danger: 'bg-danger text-surface border border-danger hover:bg-ink hover:border-ink',
  ghost: 'bg-transparent text-ink border border-transparent hover:border-line'
}

const sizes = {
  sm: 'min-h-10 px-4 text-xs',
  md: 'min-h-11 px-6 text-sm',
  lg: 'min-h-13 px-8 text-base'
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-mono font-medium uppercase tracking-[0.12em] cursor-pointer',
        'transition-colors duration-200 active:translate-y-px',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className='flex items-center justify-center gap-2'>
          <span className='inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin'></span>
          Loading...
        </span>
      ) : children}
    </button>
  )
}

export default Button
