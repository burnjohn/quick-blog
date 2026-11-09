import React from 'react'
import { classNames } from '../../../utils/helpers'

function Card({ 
  children, 
  className = '',
  hover = false,
  onClick,
  ...props 
}) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md',
        hover && 'transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Image = function CardImage({ src, alt, className = '' }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={classNames('aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105', className)} 
    />
  )
}

Card.Badge = function CardBadge({ children, className = '' }) {
  return (
    <span className={classNames(
      'px-3 py-1 inline-block rounded-full border border-cyan/30 bg-cyan/10 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cyan',
      className
    )}>
      {children}
    </span>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={classNames('p-5', className)}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h5 className={classNames('mb-2 font-display text-xl font-medium leading-snug tracking-tight text-ink', className)}>
      {children}
    </h5>
  )
}

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={classNames('mb-3 text-sm leading-relaxed text-muted', className)}>
      {children}
    </p>
  )
}

export default Card

