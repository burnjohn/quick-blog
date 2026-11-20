import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { BLOG_CATEGORIES } from '../../../constants/categories'
import { classNames } from '../../../utils/helpers'

/**
 * Category chips. `indicatorId` must be unique per instance on a page (it drives the
 * shared-layout highlight), `label` names the nav landmark.
 */
function CategoryFilter({ activeCategory, onCategoryChange, indicatorId = 'category-indicator', label = 'Filter by category' }) {
  return (
    <nav aria-label={label} className='overflow-x-auto'>
      <ul className='flex min-w-max items-stretch border-b border-ink'>
        {BLOG_CATEGORIES.map((category) => {
          const isActive = activeCategory === category

          return (
            <li key={category}>
              <button
                type='button'
                onClick={() => onCategoryChange(category)}
                aria-pressed={isActive}
                className={classNames(
                  'relative min-h-12 px-4 focus-visible:outline-offset-[-3px] focus-visible:shadow-none font-mono text-xs font-medium uppercase tracking-[0.14em] cursor-pointer transition-colors sm:px-6',
                  isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={indicatorId}
                    aria-hidden='true'
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    className='absolute inset-0 -z-0 bg-signal'
                  />
                )}
                <span className='relative z-10'>{category}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default CategoryFilter
