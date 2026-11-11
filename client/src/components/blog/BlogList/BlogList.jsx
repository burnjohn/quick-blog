import React, { useState, useMemo } from 'react'
import { useAppContext } from '../../../context/AppContext'
import CategoryFilter from '../CategoryFilter'
import BlogGrid from '../BlogGrid'

function BlogList() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { blogs, input, setInput } = useAppContext()

  const filteredBlogs = useMemo(() => {
    let result = blogs

    // Filter by search input
    if (input) {
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
      )
    }

    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter((blog) => blog.category === activeCategory)
    }

    return result
  }, [blogs, input, activeCategory])

  const handleReset = () => {
    setActiveCategory('All')
    setInput?.('')
  }

  return (
    <section aria-labelledby='latest-title' className='mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24'>
      <div className='mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
            The archive
          </p>
          <h2 id='latest-title' className='mt-3 font-serif text-5xl font-semibold tracking-tight text-ink sm:text-6xl'>
            Latest stories
          </h2>
        </div>
        <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink' aria-live='polite'>
          Showing {filteredBlogs.length} of {blogs.length}
          {input && <> · “{input}”</>}
        </p>
      </div>

      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className='mt-10'>
        <BlogGrid
          blogs={filteredBlogs}
          onReset={activeCategory !== 'All' || input ? handleReset : undefined}
        />
      </div>
    </section>
  )
}

export default BlogList
