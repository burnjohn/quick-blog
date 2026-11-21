import React from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../../layout/SectionHeading'
import Reveal from '../../ui/Reveal'
import { getBlogDetailPath } from '../../../constants/routes'
import { formatShortDate } from '../../../utils/formatters'
import { formatReadingTime, padIndex } from '../helpers'

/** Compact two-column index of the oldest stories, one small thumbnail per row */
function ArchiveList({ blogs }) {
  if (blogs.length === 0) return null

  return (
    <section id='archive' aria-labelledby='archive-title' className='mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24'>
      <SectionHeading id='archive-title' kicker='From the archive' title='Still worth reading'>
        <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'>
          Oldest first · {blogs.length} entries
        </p>
      </SectionHeading>

      <ol className='grid border-t-2 border-ink md:grid-cols-2 md:gap-x-12'>
        {blogs.map((blog, index) => (
          <Reveal as='li' key={blog._id} index={Math.floor(index / 2)} y={12} className='border-b border-ink'>
            <Link to={getBlogDetailPath(blog._id)} className='group grid grid-cols-[1.75rem_5rem_minmax(0,1fr)] items-center gap-4 py-4 transition-colors hover:bg-surface sm:grid-cols-[2.5rem_6.5rem_minmax(0,1fr)] xl:grid-cols-[2.5rem_6.5rem_minmax(0,1fr)_auto]'>
              <span className='pl-1 font-mono text-sm tabular-nums text-ink-muted transition-colors group-hover:text-ink sm:text-base'>
                {padIndex(index)}
              </span>
              <span className='relative block aspect-[4/3] overflow-hidden border border-ink bg-line'>
                <img
                  src={blog.image}
                  alt={blog.title}
                  loading='lazy'
                  className='absolute inset-0 h-full w-full object-cover grayscale-[35%] transition-[transform,filter] duration-500 ease-editorial group-hover:scale-105 group-hover:grayscale-0'
                />
              </span>
              <span className='min-w-0'>
                <span className='line-clamp-2 font-serif text-lg font-semibold leading-snug tracking-tight text-ink decoration-signal decoration-2 underline-offset-4 group-hover:underline sm:text-xl'>
                  {blog.title}
                </span>
                <span className='mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted group-hover:text-ink'>
                  {blog.category} · {formatShortDate(blog.createdAt)}
                </span>
              </span>
              <span className='hidden pr-2 font-mono text-[11px] uppercase tracking-[0.14em] whitespace-nowrap text-ink-muted group-hover:text-ink xl:block'>
                {formatReadingTime(blog.description)}
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

export default ArchiveList
