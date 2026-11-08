import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
  outline: 'border border-border bg-card text-foreground hover:bg-muted',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  ghost: 'text-foreground hover:bg-muted'
}

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base'
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
        'inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer',
        'transition-colors duration-200',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className='flex items-center justify-center gap-2'>
          <span className='inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin'></span>
          Loading...
        </span>
      ) : children}
    </button>
  )
}

export default Button
