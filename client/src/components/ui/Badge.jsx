import React from 'react'
import { classNames } from '../../utils/helpers'

const variants = {
  primary: 'bg-primary/20 text-primary border-primary/35',
  secondary: 'bg-gray-200 text-gray-700 border-gray-300',
  success: 'bg-green-100 text-green-700 border-green-300',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  danger: 'bg-red-100 text-red-700 border-red-300',
  info: 'bg-blue-100 text-blue-700 border-blue-300',
  pending: 'bg-orange-100 text-orange-700 border-orange-300'
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
}

function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) {
  return (
    <span
      className={classNames(
        'inline-block rounded-full font-medium border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

