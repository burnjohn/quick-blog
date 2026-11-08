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
      {...(onClick && {
        role: 'link',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter') onClick(e)
        }
      })}
      className={classNames(
        'rounded-card overflow-hidden border border-border bg-card text-card-foreground shadow-card',
        hover && 'hover:-translate-y-1 hover:shadow-lg hover:border-accent/40 transition-all duration-300 motion-reduce:hover:translate-y-0',
        onClick && 'cursor-pointer focus-visible:ring-4 focus-visible:ring-accent/30',
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
      className={classNames('aspect-video w-full object-cover', className)} 
    />
  )
}

Card.Badge = function CardBadge({ children, className = '' }) {
  return (
    <span className={classNames(
      'ml-5 mt-5 px-3 py-1 inline-block bg-accent-soft rounded-full text-accent text-xs font-medium tracking-wide',
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
    <h5 className={classNames('mb-2 font-display text-lg font-semibold leading-snug text-card-foreground', className)}>
      {children}
    </h5>
  )
}

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={classNames('mb-3 text-sm leading-relaxed text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export default Card

