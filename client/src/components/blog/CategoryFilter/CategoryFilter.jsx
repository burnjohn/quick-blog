import React from 'react'
import { motion } from 'motion/react'
import { BLOG_CATEGORIES } from '../../../constants/categories'

const MotionSpan = motion.span

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className='mx-auto my-10 flex max-w-full flex-wrap justify-center gap-2 px-4'>
      {BLOG_CATEGORIES.map((category) => {
        const isActive = activeCategory === category
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative cursor-pointer rounded-full border border-white/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
              isActive ? 'text-void' : 'text-muted hover:text-ink'
            }`}
          >
            {isActive && (
              <MotionSpan
                layoutId='underline'
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className='absolute inset-0 rounded-full bg-lime'
              />
            )}
            <span className='relative'>{category}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
