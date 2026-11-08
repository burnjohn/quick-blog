import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  primary: 'bg-accent-soft text-accent border-accent/25',
  secondary: 'bg-secondary text-secondary-foreground border-border',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-destructive/10 text-destructive border-destructive/30',
  info: 'bg-accent-soft text-accent border-accent/25'
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
