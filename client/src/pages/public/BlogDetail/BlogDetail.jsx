import React from 'react'
import { useParams } from 'react-router-dom'
import { Navbar, Footer } from '../../../components/layout'
import { BlogHeader, BlogContent, SocialShare } from '../../../components/blog'
import { CommentList, CommentForm } from '../../../components/comment'
import { Loader } from '../../../components/ui'
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
    <div className='relative min-h-dvh bg-paper text-ink'>
      <div
        aria-hidden='true'
        className='reading-progress fixed inset-x-0 top-0 z-50 h-1 bg-signal'
      />

      <Navbar />

      <main id='main' tabIndex={-1} className='outline-none'>
        <article>
          <BlogHeader blog={blog} />
          <BlogContent image={blog.image} title={blog.title} content={blog.description} />
        </article>

        <section
          aria-label='Discussion'
          className='mx-auto grid max-w-7xl gap-16 border-t border-ink px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12'
        >
          <div className='lg:col-span-7'>
            <CommentList comments={comments} />
          </div>
          <div className='lg:col-span-5'>
            <CommentForm onSubmit={handleAddComment} />
            <SocialShare />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BlogDetail
