import React from 'react'
import SectionHeading from '../../layout/SectionHeading'
import Reveal from '../../ui/Reveal'
import StoryTile from '../StoryTile'

/** "Read next": related posts (same category first), revealed on scroll */
function ReadNext({ posts, category }) {
  if (posts.length === 0) return null

  const sameDesk = posts.every((post) => post.category === category)

  return (
    <section aria-labelledby='read-next-title' className='mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24'>
      <SectionHeading
        id='read-next-title'
        kicker={sameDesk && category ? `More from ${category}` : 'Keep reading'}
        title='Read next'
      />
      <ul className='grid gap-8 md:grid-cols-3'>
        {posts.map((post, index) => (
          <Reveal as='li' key={post._id} index={index}>
            <StoryTile blog={post} index={index} tone={index === 1 ? 'signal' : 'surface'} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default ReadNext
