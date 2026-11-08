import React from 'react'

function BlogContent({ image, content }) {
  return (
    <article className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
      {image && (
        <img src={image} alt='' className='rounded-3xl mb-12 w-full aspect-video object-cover border border-border' />
      )}
      <div 
        className='rich-text' 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  )
}

export default BlogContent

