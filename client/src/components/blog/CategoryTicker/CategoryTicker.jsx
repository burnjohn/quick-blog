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
          <span aria-hidden='true' className='inline-block h-3 w-3 rotate-45 bg-ink sm:h-4 sm:w-4' />
        </li>
      ))}
    </ul>
  )
}

function CategoryTicker() {
  return (
    <div className='overflow-hidden border-y border-ink bg-signal py-4 sm:py-5'>
      <p className='sr-only'>Topics: {TICKER_CATEGORIES.join(', ')}</p>
      <div aria-hidden='true' className='marquee-track flex w-max animate-marquee'>
        <TickerRow />
        <TickerRow hidden />
      </div>
    </div>
  )
}

export default CategoryTicker
