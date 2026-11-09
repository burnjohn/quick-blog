import React, { useState, useMemo } from 'react'
import { useAppContext } from '../../../context/AppContext'
import CategoryFilter from '../CategoryFilter'
import BlogGrid from '../BlogGrid'

function BlogList() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { blogs, input } = useAppContext()

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

  return (
    <section aria-label='Latest posts' className='mx-auto max-w-7xl px-6 py-16 sm:px-10'>
      <div className='flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>
        <span>[ 02 ] LATEST</span>
        <span>{String(filteredBlogs.length).padStart(2, '0')} ENTRIES</span>
      </div>
      <CategoryFilter 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <BlogGrid blogs={filteredBlogs} />
    </section>
  )
}

export default BlogList
