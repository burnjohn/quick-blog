import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL } from '../../ui/Reveal'
import { classNames } from '../../../utils/helpers'

// Editorial overrides for the editor HTML. `!` is needed: .rich-text rules in index.css are unlayered.
const ARTICLE_TYPE = [
  '[&_h2]:scroll-mt-32 [&_h2]:border-t [&_h2]:border-ink [&_h2]:pt-6',
  '[&_blockquote]:relative [&_blockquote]:my-14! [&_blockquote]:border-l-0! [&_blockquote]:border-y-2 [&_blockquote]:border-ink',
  '[&_blockquote]:py-10! [&_blockquote]:pl-0! [&_blockquote]:text-3xl! [&_blockquote]:leading-[1.15]! sm:[&_blockquote]:text-4xl!',
  "[&_blockquote]:before:absolute [&_blockquote]:before:-top-7 [&_blockquote]:before:left-0 [&_blockquote]:before:content-['“']",
  '[&_blockquote]:before:-rotate-3 [&_blockquote]:before:border-2 [&_blockquote]:before:border-ink [&_blockquote]:before:bg-signal',
  '[&_blockquote]:before:px-3 [&_blockquote]:before:pt-3 [&_blockquote]:before:text-6xl [&_blockquote]:before:leading-[0.6] [&_blockquote]:before:not-italic'
].join(' ')

/**
 * Cover + article body. Optional `children` render as the side rail
 * (sticky on large screens, above the body on small ones).
 */
function BlogContent({ image, title = '', content, children }) {
  return (
    <div className='mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16'>
      {image && (
        <figure className='relative mb-14 overflow-hidden border border-ink bg-surface shadow-hard sm:mb-20'>
          <motion.img
            src={image}
            alt={title ? `Cover image for “${title}”` : ''}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE_EDITORIAL }}
            className='aspect-[16/9] w-full object-cover'
          />
        </figure>
      )}
      <div className={classNames(children && 'grid gap-12 lg:grid-cols-12 lg:gap-10')}>
        {children && <div className='lg:col-span-3'>{children}</div>}
        <div
          className={classNames('rich-text', ARTICLE_TYPE, children ? 'lg:col-span-8 lg:col-start-5' : 'mx-auto')}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export default BlogContent
