import React from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../../layout/SectionHeading'
import Reveal from '../../ui/Reveal'
import Sticker from '../../ui/Sticker'
import { getBlogDetailPath } from '../../../constants/routes'
import { truncateHtml } from '../../../utils/formatters'
import { formatReadingTime } from '../helpers'

/** The page's one ink band: the long reads, each led by its cover with a numbered sticker */
function EditorsPicks({ picks }) {
  if (picks.length === 0) return null

  return (
    <section id='picks' aria-labelledby='picks-title' className='mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24'>
      <div className='relative overflow-hidden border border-ink bg-ink px-5 pt-10 pb-6 text-paper shadow-hard-signal sm:px-10 sm:pt-14 sm:pb-10'>
        <span aria-hidden='true' className='halftone-signal pointer-events-none absolute -right-16 -top-16 h-72 w-72 rotate-12 opacity-50' />
        <span
          aria-hidden='true'
          className='pointer-events-none absolute -bottom-24 right-4 select-none font-serif text-[22rem] font-semibold leading-none text-paper/5'
        >
          §
        </span>

        <div className='relative'>
          <Sticker tilt='right' className='mb-6'>Hand-picked · long reads</Sticker>
          <SectionHeading id='picks-title' kicker="Editor's picks" title='Worth the evening' tone='ink' />

          <ol className='grid gap-0 md:grid-cols-3'>
            {picks.map((blog, index) => (
              <Reveal
                as='li'
                key={blog._id}
                index={index}
                className='border-t border-paper/20 md:border-l md:border-t-0 md:px-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-8'
              >
                <Link
                  to={getBlogDetailPath(blog._id)}
                  className='group flex h-full flex-col py-8'
                >
                  <span className='relative block aspect-[4/3] border border-paper/30'>
                    <span className='absolute inset-0 overflow-hidden'>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        loading='lazy'
                        className='h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105'
                      />
                    </span>
                    <span
                      aria-hidden='true'
                      className='absolute -bottom-6 left-4 border border-ink bg-signal px-3 pt-1.5 font-serif text-6xl font-semibold leading-[0.8] tracking-tight text-ink shadow-hard-sm transition-transform duration-200 ease-editorial group-hover:-translate-y-1'
                    >
                      {index + 1}
                    </span>
                  </span>
                  <p className='mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>
                    § {blog.category} · {formatReadingTime(blog.description)}
                  </p>
                  <h3 className='mt-3 font-serif text-2xl font-semibold leading-[1.05] tracking-tight decoration-signal decoration-[3px] underline-offset-4 group-hover:underline lg:text-3xl'>
                    {blog.title}
                  </h3>
                  <p className='mt-3 font-serif text-lg italic leading-snug text-paper/70'>
                    {blog.subTitle || truncateHtml(blog.description, 110)}
                  </p>
                  <span className='mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-paper'>
                    Read it
                    <span aria-hidden='true' className='transition-transform duration-200 group-hover:translate-x-1'>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default EditorsPicks
