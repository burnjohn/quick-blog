import React, { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import SectionHeading from '../../layout/SectionHeading'
import CategoryFilter from '../CategoryFilter'
import BlogGrid from '../BlogGrid'
import { filterBlogs, sortByNewest } from '../helpers'

const PAGE_SIZE = 6

/**
 * Filterable "Latest" section. Searching / filtering looks at every story;
 * the unfiltered view skips `excludeIds` (stories already on the front).
 */
function BlogList({ excludeIds = [] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { blogs = [], input = '', setInput } = useAppContext()

  const isFiltering = Boolean(input) || activeCategory !== 'All'
  const pool = isFiltering ? blogs : blogs.filter((blog) => !excludeIds.includes(blog._id))
  const filteredBlogs = filterBlogs(sortByNewest(pool), { search: input, category: activeCategory })
  const visibleBlogs = filteredBlogs.slice(0, visibleCount)
  const remaining = filteredBlogs.length - visibleBlogs.length

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setVisibleCount(PAGE_SIZE)
  }

  const handleReset = () => {
    handleCategoryChange('All')
    setInput?.('')
  }

  return (
    <section id='latest' aria-labelledby='latest-title' className='mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24'>
      <SectionHeading
        id='latest-title'
        kicker={input ? 'Search' : 'Latest'}
        title={input ? 'Search results' : 'Latest stories'}
      >
        <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink tabular-nums' aria-live='polite'>
          Showing {visibleBlogs.length} of {filteredBlogs.length}
          {input && <> · “{input}”</>}
        </p>
      </SectionHeading>

      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className='mt-10'>
        <BlogGrid
          blogs={visibleBlogs}
          staggerFrom={visibleCount - PAGE_SIZE}
          onReset={isFiltering ? handleReset : undefined}
        />
      </div>

      {remaining > 0 && (
        <div className='mt-12 flex justify-center'>
          <button
            type='button'
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className='group lift inline-flex min-h-12 items-center gap-3 border border-ink bg-surface px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink shadow-hard-sm cursor-pointer hover:bg-signal hover:shadow-hard'
          >
            Load {Math.min(remaining, PAGE_SIZE)} more
            <span aria-hidden='true' className='transition-transform duration-200 group-hover:translate-y-0.5'>↓</span>
          </button>
        </div>
      )}
    </section>
  )
}

export default BlogList
