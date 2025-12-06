import React from 'react'
import { getImageUrl } from '../../utils/helpers'

function BlogContent({ image, content }) {
  return (
    <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
      {image && (
        <img src={getImageUrl(image)} alt='' className='rounded-3xl mb-5 w-full' />
      )}
      <div 
        className='rich-text max-w-3xl mx-auto' 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default BlogContent

