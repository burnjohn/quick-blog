import React from 'react'
import { classNames } from '../../utils/helpers'

function Textarea({
  label,
  error,
  className = '',
  containerClassName = '',
  rows = 4,
  required = false,
  ...props
}) {
  return (
    <div className={classNames('w-full', containerClassName)}>
      {label && (
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        required={required}
        className={classNames(
          'w-full p-2 border rounded outline-none transition-colors resize-none',
          error 
            ? 'border-red-500 focus:border-red-600' 
            : 'border-gray-300 focus:border-primary',
          className
        )}
        {...props}
      />
      {error && (
        <p className='mt-1 text-sm text-red-500'>{error}</p>
      )}
    </div>
  )
}

export default Textarea

