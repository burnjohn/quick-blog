import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navbar, Footer } from '../../../components/layout'
import PageTransition from '../../../components/layout/PageTransition'
import { BlogHeader, BlogContent } from '../../../components/blog'
import ArticleAside from '../../../components/blog/ArticleAside'
import ReadNext from '../../../components/blog/ReadNext'
import ArticleNotFound from '../../../components/blog/ArticleNotFound'
import { buildArticleOutline, getRelatedPosts } from '../../../components/blog/helpers'
import { CommentList, CommentForm } from '../../../components/comment'
import { Loader } from '../../../components/ui'
import { useBlog, useComments } from '../../../hooks'
import { useAppContext } from '../../../context/AppContext'
import { ROUTES } from '../../../constants/routes'

function PublicShell({ children }) {
  return (
    <div className='relative min-h-dvh bg-paper text-ink'>
      <Navbar />
      <main id='main' tabIndex={-1} className='outline-none'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading, error } = useBlog(id)
  const { comments, addComment } = useComments(id)
  const { blogs = [] } = useAppContext()

  // Parsing the article HTML is the one non-trivial computation on this page
  const outline = useMemo(() => buildArticleOutline(blog?.description), [blog?.description])
  const related = getRelatedPosts(blogs, blog)

  const handleAddComment = async (commentData) => {
    return await addComment({
      blog: id,
      name: commentData.name,
      content: commentData.content
    })
  }

  if (blogLoading) {
    return <Loader />
  }

  if (error || !blog) {
    return (
      <PublicShell>
        <ArticleNotFound message={error} />
      </PublicShell>
    )
  }

  return (
    <>
      <div
        aria-hidden='true'
        className='reading-progress fixed inset-x-0 top-0 z-50 h-1 bg-signal'
      />
      <PublicShell>
        <PageTransition key={id}>
          <article>
            <BlogHeader blog={blog}>
              <Link to={ROUTES.HOME} className='group inline-flex min-h-11 items-center gap-2 text-ink'>
                <span aria-hidden='true' className='transition-transform duration-200 group-hover:-translate-x-1'>←</span>
                <span className='relative'>
                  Front page
                  <span aria-hidden='true' className='absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-ink transition-transform duration-200 group-hover:scale-x-100' />
                </span>
              </Link>
            </BlogHeader>
            <BlogContent image={blog.image} title={blog.title} content={outline.html}>
              <ArticleAside headings={outline.headings} />
            </BlogContent>
          </article>

          <div className='section-counter border-t-2 border-ink'>
            <section
              aria-label='Discussion'
              className='bg-surface/60'
            >
              <div className='mx-auto grid max-w-7xl gap-16 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12'>
                <div className='lg:col-span-7'>
                  <CommentList comments={comments} />
                </div>
                <div className='lg:col-span-5 lg:pt-10'>
                  <div className='lg:sticky lg:top-28'>
                    <CommentForm onSubmit={handleAddComment} />
                  </div>
                </div>
              </div>
            </section>

            <div className='border-t border-ink'>
              <ReadNext posts={related} category={blog.category} />
            </div>
          </div>
        </PageTransition>
      </PublicShell>
    </>
  )
}

export default BlogDetail
