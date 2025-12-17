import React from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { Navbar, Footer } from '../../components/layout'
import { BlogHeader, BlogContent, SocialShare, CommentForm, CommentsList } from '../../components/blog'
import { Loader } from '../../components/ui'
import { useBlog, useBlogComments } from '../../hooks'

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading } = useBlog(id)
  const { comments, loading: commentsLoading, refetch } = useBlogComments(id)

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
      
      <div className='mx-5 max-w-5xl md:mx-auto my-10'>
        <CommentForm blogId={blog._id} onSuccess={refetch} />
      </div>
      
      <SocialShare />
      
      <div className='mx-5 max-w-5xl md:mx-auto my-10'>
        {!commentsLoading && <CommentsList comments={comments} />}
      </div>
      
      <Footer />
    </div>
  )
}

export default BlogDetail
