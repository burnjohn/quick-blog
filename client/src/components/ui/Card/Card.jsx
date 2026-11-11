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
        'group flex flex-col bg-surface border border-line overflow-hidden',
        hover && 'transition-colors duration-300 hover:border-ink',
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
    <div className='overflow-hidden border-b border-line'>
      <img
        src={src}
        alt={alt}
        loading='lazy'
        className={classNames(
          'aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105',
          className
        )}
      />
    </div>
  )
}

Card.Badge = function CardBadge({ children, className = '' }) {
  return (
    <span className={classNames(
      'mx-5 mt-5 self-start inline-block bg-signal px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink',
      className
    )}>
      {children}
    </span>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={classNames('flex flex-1 flex-col p-5 pt-3', className)}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={classNames(
      'mb-3 font-serif text-2xl font-semibold leading-tight text-ink decoration-signal decoration-[3px] underline-offset-4 group-hover:underline',
      className
    )}>
      {children}
    </h3>
  )
}

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={classNames('text-sm leading-relaxed text-ink-muted', className)}>
      {children}
    </p>
  )
}

export default Card
