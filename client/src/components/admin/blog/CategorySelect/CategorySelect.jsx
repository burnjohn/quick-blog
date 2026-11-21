import React from 'react'
import { BLOG_CATEGORIES } from '../../../../constants/categories'

// Category picker for the ink publish panel (excludes the "All" pseudo-category).
function CategorySelect({ value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor='category' className='mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-paper'>
        Blog Category <span className='text-signal' aria-hidden='true'>*</span>
      </label>
      <select
        id='category'
        onChange={(e) => onChange(e.target.value)}
        value={value}
        name='category'
        className='min-h-12 w-full cursor-pointer border border-paper/50 bg-ink px-3 text-paper outline-none transition-colors hover:border-signal focus:border-signal'
        disabled={disabled}
      >
        {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))}
      </select>
    </div>
  )
}

export default CategorySelect
