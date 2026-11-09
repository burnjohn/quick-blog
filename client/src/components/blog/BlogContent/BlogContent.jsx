import React from 'react'
import { Parallax } from '../../effects'

function BlogContent({ image, content }) {
  return (
    <div className='mx-5 max-w-5xl md:mx-auto my-10'>
      {image && (
        <div className='overflow-hidden rounded-3xl border border-white/10 mb-12'>
          <Parallax offset={10}>
            <img src={image} alt='' className='w-full scale-110' />
          </Parallax>
        </div>
      )}
      <div
        className='rich-text max-w-[72ch] mx-auto break-words'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default BlogContent
