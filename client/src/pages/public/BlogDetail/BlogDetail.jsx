import React from 'react'
import { useParams } from 'react-router-dom'
import { Navbar, Footer } from '../../../components/layout'
import { BlogHeader, BlogContent, SocialShare } from '../../../components/blog'
import { CommentList, CommentForm } from '../../../components/comment'
import { Loader } from '../../../components/ui'
import { ReadingProgress, Reveal } from '../../../components/effects'
import { useBlog, useComments } from '../../../hooks'

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
    <div className='relative overflow-x-clip'>
      <ReadingProgress />

      <Navbar />
      
      <BlogHeader blog={blog} />
      
      <BlogContent image={blog.image} content={blog.description} />
      
      <Reveal>
        <CommentList comments={comments} />
      </Reveal>

      <Reveal>
        <CommentForm onSubmit={handleAddComment} />
      </Reveal>

      <Reveal>
        <SocialShare />
      </Reveal>
      
      <Footer />
    </div>
  )
}

export default BlogDetail
