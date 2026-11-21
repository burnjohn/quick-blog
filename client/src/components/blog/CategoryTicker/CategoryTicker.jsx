import React from 'react'
import { BLOG_CATEGORIES } from '../../../constants/categories'

const TICKER_CATEGORIES = BLOG_CATEGORIES.filter((category) => category !== 'All')

function TickerRow({ hidden = false }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center ${hidden ? 'marquee-clone' : ''}`}
    >
      {[...TICKER_CATEGORIES, ...TICKER_CATEGORIES].map((category, index) => (
        <li
          key={`${category}-${index}`}
          className='flex items-center gap-8 px-4 font-serif text-3xl italic text-ink sm:text-5xl'
        >
          {category}
          <span aria-hidden='true' className='font-mono text-base not-italic text-ink sm:text-xl'>§</span>
        </li>
      ))}
    </ul>
  )
}

function CategoryTicker() {
  return (
    <div className='relative flex items-stretch overflow-hidden border-y-2 border-ink bg-signal'>
      <p className='sr-only'>Topics: {TICKER_CATEGORIES.join(', ')}</p>
      <span
        aria-hidden='true'
        className='relative z-10 hidden shrink-0 items-center border-r-2 border-ink bg-ink px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-signal sm:flex'
      >
        On the desks
      </span>
      <div className='min-w-0 flex-1 overflow-hidden py-4 sm:py-5'>
        <div aria-hidden='true' className='marquee-track flex w-max animate-marquee'>
          <TickerRow />
          <TickerRow hidden />
        </div>
      </div>
    </div>
  )
}

export default CategoryTicker
