import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import { classNames } from '../../../utils/helpers'
import Sticker from '../../ui/Sticker'
import { formatReadingTime } from '../helpers'

// Caption is always visible on touch screens; on hover-capable devices it rises in on hover/focus
const CAPTION_HIDDEN_ON_HOVER_DEVICES =
  '[@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100'

/** Image-first gallery tile; the tile's box (grid cell) sets the size, the photo fills it */
function GalleryTile({ blog, featured = false }) {
  const { _id, title, category, image, description } = blog

  return (
    <Link
      to={getBlogDetailPath(_id)}
      className='group relative block h-full overflow-hidden border border-ink bg-ink shadow-hard-sm transition-shadow duration-200 hover:shadow-hard'
    >
      <img
        src={image}
        alt={title}
        loading='lazy'
        className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105 group-focus-visible:scale-105'
      />

      <Sticker size='sm' tilt='none' className='absolute left-3 top-3'>{category}</Sticker>

      <span
        className={classNames(
          'absolute inset-x-0 bottom-0 block bg-linear-to-t from-ink/95 via-ink/60 to-transparent px-3 pb-3 pt-10 text-paper sm:px-4 sm:pb-4 sm:pt-16 transition-[opacity,transform] duration-300 ease-editorial',
          featured && 'sm:px-6 sm:pb-6',
          CAPTION_HIDDEN_ON_HOVER_DEVICES
        )}
      >
        <span className={classNames(
          'font-serif font-semibold leading-[1.1] tracking-tight',
          featured ? 'line-clamp-3 text-2xl sm:text-4xl' : 'line-clamp-2 text-base sm:line-clamp-3 sm:text-xl'
        )}>
          {title}
        </span>
        <span className='mt-1.5 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-signal sm:block'>
          {formatReadingTime(description)} →
        </span>
      </span>
    </Link>
  )
}

export default GalleryTile
