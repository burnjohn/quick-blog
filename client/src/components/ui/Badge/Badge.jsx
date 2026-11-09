import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  primary: 'bg-primary/10 text-primary border-primary/30',
  secondary: 'bg-white/5 text-muted border-white/10',
  success: 'bg-lime/10 text-lime border-lime/30',
  warning: 'bg-ember/10 text-ember border-ember/30',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
  info: 'bg-cyan/10 text-cyan border-cyan/30'
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
        'inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.14em] text-[0.7rem]',
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

