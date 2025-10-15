import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { BLOG_CATEGORIES } from '../../constants/categories'

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
      {BLOG_CATEGORIES.map((category) => (
        <div key={category} className='relative'>
          <button 
            onClick={() => onCategoryChange(category)}
            className={`cursor-pointer text-gray-500 ${
              activeCategory === category && 'text-white px-4 pt-0.5'
            }`}
          >
            {category}
            {activeCategory === category && (
              <motion.div 
                layoutId='underline' 
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'
              />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

export default CategoryFilter

