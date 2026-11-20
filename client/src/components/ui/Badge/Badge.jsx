import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  primary: 'bg-signal text-ink border-ink',
  secondary: 'bg-surface text-ink border-line',
  success: 'bg-surface text-success border-success',
  warning: 'bg-signal/30 text-ink border-ink',
  danger: 'bg-surface text-danger border-danger',
  info: 'bg-ink text-paper border-ink'
}

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
  lg: 'px-3 py-1.5 text-xs'
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
        'inline-block border font-mono font-medium uppercase tracking-[0.14em]',
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
