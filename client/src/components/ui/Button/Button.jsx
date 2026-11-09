import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  primary: 'bg-lime text-void hover:shadow-glow-lime hover:-translate-y-0.5',
  secondary: 'bg-white/10 text-ink border border-white/10 hover:bg-white/15 hover:border-white/20',
  outline: 'border border-white/20 text-ink hover:border-primary hover:text-primary hover:bg-primary/5',
  danger: 'bg-rose-500/15 text-rose-300 border border-rose-400/30 hover:bg-rose-500/25',
  ghost: 'text-muted hover:text-ink hover:bg-white/5'
}

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-7 py-2.5 text-sm',
  lg: 'px-9 py-3.5 text-base'
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
        'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out cursor-pointer',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
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

