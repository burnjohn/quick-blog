import React from 'react'
import { classNames } from '../../../utils/helpers'

function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  ...props
}) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  const style = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      role='status'
      aria-busy='true'
      aria-live='polite'
      className={classNames(
        'animate-pulse bg-gray-200',
        roundedClasses[rounded] ?? roundedClasses.md,
        className
      )}
      style={style}
      {...props}
    >
      <span className='sr-only'>Loading…</span>
    </div>
  )
}

export default Skeleton
