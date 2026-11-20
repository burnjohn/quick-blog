import React from 'react'
import { Link } from 'react-router-dom'
import Sticker from '../../ui/Sticker'
import { ROUTES } from '../../../constants/routes'

/** Shown when a story can't be loaded (missing, unpublished or a network error) */
function ArticleNotFound({ message }) {
  return (
    <section aria-labelledby='not-found-title' className='mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24'>
      <div className='relative grid overflow-hidden border border-ink bg-ink text-paper shadow-hard-signal md:grid-cols-12'>
        <div className='halftone-signal relative border-b border-paper/20 p-8 md:col-span-5 md:border-b-0 md:border-r sm:p-10'>
          <p aria-hidden='true' className='font-serif text-[8rem] font-semibold leading-[0.85] tracking-tighter text-paper sm:text-[11rem]'>
            404
          </p>
          <Sticker size='lg' className='mt-4'>Stop the press</Sticker>
        </div>
        <div className='flex flex-col justify-center p-8 md:col-span-7 sm:p-10'>
          <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>§ Story not found</p>
          <h1 id='not-found-title' className='mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl'>
            This story isn’t on the press any more.
          </h1>
          <p className='mt-5 max-w-lg text-paper/70'>
            It may have been unpublished, moved or never existed.
            {message && <span className='mt-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50'>Details: {message}</span>}
          </p>
          <Link
            to={ROUTES.HOME}
            className='group mt-8 inline-flex min-h-12 items-center gap-3 self-start border border-signal bg-signal px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-paper'
          >
            <span aria-hidden='true' className='transition-transform duration-200 group-hover:-translate-x-1'>←</span>
            Back to the front page
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ArticleNotFound
