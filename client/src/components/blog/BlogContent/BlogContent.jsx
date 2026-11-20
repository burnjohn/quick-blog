import React from 'react'

function BlogContent({ image, title = '', content }) {
  return (
    <div className='mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16'>
      {image && (
        <figure className='mb-14 border border-ink bg-surface sm:mb-20'>
          <img
            src={image}
            alt={title ? `Cover image for “${title}”` : ''}
            className='aspect-[16/9] w-full object-cover'
          />
        </figure>
      )}
      <div
        className='rich-text mx-auto'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default BlogContent
