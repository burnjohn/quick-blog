import React from 'react'
import { classNames } from '../../utils/helpers'

function Container({ children, className = '', size = 'default' }) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={classNames(
      'mx-auto px-5',
      sizes[size],
      className
    )}>
      {children}
    </div>
  )
}

export default Container

