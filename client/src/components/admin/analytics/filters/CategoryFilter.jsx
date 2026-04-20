import React from 'react'
import { BLOG_CATEGORIES } from '../../../../constants/categories'

function CategoryFilter({ value = 'All', onChange }) {
  return (
    <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
      <span className='sr-only'>Category</span>
      <select
        aria-label='Category'
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className='rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none'
      >
        {BLOG_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CategoryFilter
