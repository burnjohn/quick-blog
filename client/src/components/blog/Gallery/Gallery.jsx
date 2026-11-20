import React, { useState } from 'react'
import SectionHeading from '../../layout/SectionHeading'
import Reveal from '../../ui/Reveal'
import CategoryFilter from '../CategoryFilter'
import { filterBlogs, photosFirst, uniqueByImage } from '../helpers'
import GalleryTile from './GalleryTile'

const TILE_COUNT = 7

/*
 * Bento rhythm (lg: 4 columns, mobile: 2). Index → cell span:
 *   lg  ┌─0─┬─0─┬─1─┬─2─┐      mobile ┌─0─┬─0─┐
 *       ├─0─┼─0─┼─3─┼─2─┤             ├─0─┼─0─┤
 *       └─4─┴─4─┴─5─┴─6─┘             ├─1─┼─2─┤ …
 * Photo covers go first (photosFirst), so the big tiles get photographs;
 * repeated cover images are skipped so the grid never shows the same picture twice.
 */
const TILE_SPANS = [
  'col-span-2 row-span-2',
  '',
  'row-span-2',
  '',
  'col-span-2',
  '',
  ''
]

/** "In pictures": image-led bento of covers with an optional category filter */
function Gallery({ blogs }) {
  const [category, setCategory] = useState('All')
  const tiles = uniqueByImage(photosFirst(filterBlogs(blogs, { category }))).slice(0, TILE_COUNT)

  if (blogs.length === 0) return null

  return (
    <section id='gallery' aria-labelledby='gallery-title' className='mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24'>
      <SectionHeading id='gallery-title' kicker='Gallery' title='In pictures'>
        <p className='max-w-xs text-sm leading-relaxed text-ink-muted'>
          The edition through its covers. Pick a desk to narrow it down.
        </p>
      </SectionHeading>

      <CategoryFilter
        activeCategory={category}
        onCategoryChange={setCategory}
        indicatorId='gallery-category-indicator'
        label='Filter gallery by category'
      />

      <ul
        aria-live='polite'
        className='mt-8 grid grid-flow-row-dense auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:auto-rows-[14rem] lg:grid-cols-4 lg:gap-5'
      >
        {tiles.map((blog, index) => (
          <Reveal as='li' key={blog._id} index={index} className={TILE_SPANS[index]}>
            <GalleryTile blog={blog} featured={index === 0} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default Gallery
