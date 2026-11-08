import React from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import { BLOG_CATEGORIES } from '../../../constants/categories'

function CategoryFilter({ activeCategory, onCategoryChange }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className='flex flex-wrap justify-center gap-2 sm:gap-3 my-10 px-6 relative'>
      {BLOG_CATEGORIES.map((category) => (
        <div key={category} className='relative'>
          <button 
            onClick={() => onCategoryChange(category)}
            aria-pressed={activeCategory === category}
            className={`relative isolate cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
              activeCategory === category
                ? 'text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {category}
            {activeCategory === category && (
              <motion.div 
                layoutId='underline' 
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
                className='absolute inset-0 -z-1 bg-accent rounded-full'
              />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

export default CategoryFilter

