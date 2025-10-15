import React, { useState, useMemo } from 'react'
import { useAppContext } from '../../context/AppContext'
import CategoryFilter from './CategoryFilter'
import BlogGrid from './BlogGrid'

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
    <div>
      <CategoryFilter 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <BlogGrid blogs={filteredBlogs} />
    </div>
  )
}

export default BlogList
