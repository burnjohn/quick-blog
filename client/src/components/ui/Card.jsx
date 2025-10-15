import React from 'react'
import { classNames } from '../../utils/helpers'

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
        'rounded-lg overflow-hidden shadow bg-white',
        hover && 'hover:scale-102 hover:shadow-primary/25 transition-all duration-300',
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
      className={classNames('aspect-video w-full object-cover', className)} 
    />
  )
}

Card.Badge = function CardBadge({ children, className = '' }) {
  return (
    <span className={classNames(
      'ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs',
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
    <h5 className={classNames('mb-2 font-medium text-gray-900', className)}>
      {children}
    </h5>
  )
}

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={classNames('mb-3 text-xs text-gray-600', className)}>
      {children}
    </p>
  )
}

export default Card

