import React from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { Navbar, Footer } from '../../components/layout'
import { BlogHeader, BlogContent, SocialShare } from '../../components/blog'
import { CommentList, CommentForm } from '../../components/comment'
import { Loader } from '../../components/ui'
import { useBlog, useComments } from '../../hooks'

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading } = useBlog(id)
  const { comments, addComment } = useComments(id)

  const handleAddComment = async (commentData) => {
    return await addComment({
      blog: id,
      name: commentData.name,
      content: commentData.content
    })
  }

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
      
      <CommentList comments={comments} />
      
      <CommentForm onSubmit={handleAddComment} />
      
      <SocialShare />
      
      <Footer />
    </div>
  )
}

export default BlogDetail
