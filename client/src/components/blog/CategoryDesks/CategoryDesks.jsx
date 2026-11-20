import React from 'react'
import SectionHeading from '../../layout/SectionHeading'
import Reveal from '../../ui/Reveal'
import { BLOG_CATEGORIES } from '../../../constants/categories'
import { groupByCategory, withPhotoLead } from '../helpers'
import DeskPanel from './DeskPanel'

const DESK_CATEGORIES = BLOG_CATEGORIES.filter((category) => category !== 'All')

/**
 * Per-category rails. Expects blogs sorted newest first; `excludeIds` (the cover
 * stories) are skipped so the desks don't repeat the first screen.
 */
function CategoryDesks({ blogs, excludeIds = [] }) {
  const pool = blogs.filter((blog) => !excludeIds.includes(blog._id))
  const desks = groupByCategory(pool, DESK_CATEGORIES)
  if (desks.length === 0) return null
  const totals = Object.fromEntries(groupByCategory(blogs, DESK_CATEGORIES).map((desk) => [desk.category, desk.posts.length]))

  return (
    <section id='desks' aria-labelledby='desks-title' className='mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24'>
      <SectionHeading id='desks-title' kicker='The desks' title='By the desk'>
        <p className='max-w-xs text-sm leading-relaxed text-ink-muted'>
          Every beat we cover: a lead picture up top, the latest headlines below.
        </p>
      </SectionHeading>

      <ul className='grid gap-8 md:grid-cols-2'>
        {desks.map((desk, index) => (
          <Reveal as='li' key={desk.category} index={index}>
            <DeskPanel category={desk.category} posts={withPhotoLead(desk.posts)} total={totals[desk.category]} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default CategoryDesks
