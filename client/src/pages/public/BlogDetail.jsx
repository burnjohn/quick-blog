import React from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { Navbar, Footer } from '../../components/layout'
import { BlogHeader, BlogContent, SocialShare } from '../../components/blog'
import { Loader } from '../../components/ui'
import { useBlog } from '../../hooks'

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading } = useBlog(id)

  if (blogLoading || !blog) {
    return <Loader />
  }

  return (
    <div className='relative'>
      <img 
        src={assets.gradientBackground} 
        alt='' 
        className='absolute -top-50 -z-1 opacity-50'
      />
      
      <Navbar />
      
      <BlogHeader blog={blog} />
      
      <BlogContent image={blog.image} content={blog.description} />
      
      <SocialShare />
      
      <Footer />
    </div>
  )
}

export default BlogDetail
