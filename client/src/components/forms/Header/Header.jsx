import React from 'react'
import { useAppContext } from '../../../context/AppContext'
import SearchBar from '../SearchBar'

/**
 * Slim front-page masthead: the tagline as a small kicker, compact search,
 * and the cover (`children`) right underneath so stories own the first screen.
 * Search sits in the masthead on lg and in a slim bar under the cover below lg.
 */
function Header({ children }) {
  const { setInput, input } = useAppContext()

  const search = (
    <SearchBar
      compact
      onSearch={setInput}
      onClear={() => setInput('')}
      hasSearchTerm={!!input}
    />
  )

  return (
    <section aria-labelledby='hero-title' className='mx-auto max-w-7xl px-5 pt-4 sm:px-8 sm:pt-6'>
      <div className='flex items-center justify-between gap-6 border-b-2 border-ink pb-3'>
        <h1 id='hero-title' className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink'>
          The QuickBlog Journal
          <span className='hidden text-ink-muted sm:inline'> — your own blogging platform</span>
        </h1>
        <div className='hidden w-full max-w-md lg:block'>{search}</div>
      </div>

      {children}

      <div className='mt-8 lg:hidden'>{search}</div>
    </section>
  )
}

export default Header
