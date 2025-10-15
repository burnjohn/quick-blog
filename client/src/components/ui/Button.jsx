import React from 'react'
import { classNames } from '../../utils/helpers'

const variants = {
  primary: 'bg-primary text-white hover:scale-105 hover:bg-primary/90',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'hover:bg-gray-100 text-gray-700'
}

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-8 py-2',
  lg: 'px-10 py-2.5 text-lg'
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
        'rounded transition-all cursor-pointer font-medium',
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

