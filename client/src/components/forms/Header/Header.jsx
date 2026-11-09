import React from 'react'
import { assets } from '../../../assets/assets'
import { useAppContext } from '../../../context/AppContext'
import SearchBar from '../SearchBar'
import Badge from '../../ui/Badge'
import { Parallax } from '../../effects'

function Header() {
  const { setInput, input } = useAppContext()

  const handleSearch = (searchTerm) => {
    setInput(searchTerm)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-32 sm:px-16'>
      {/* Decorative parallax layers */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        <Parallax offset={14} className='absolute -left-24 top-24 size-72 sm:size-96'>
          <div className='size-full rounded-full bg-violet-deep/30 blur-3xl' />
        </Parallax>
        <Parallax offset={10} className='absolute -right-20 bottom-20 size-64 sm:size-80'>
          <div className='size-full rounded-full bg-cyan/15 blur-3xl' />
        </Parallax>
        <Parallax offset={12} className='absolute right-[8%] top-28 size-40 sm:size-64'>
          <div className='size-full rounded-full border border-white/10' />
        </Parallax>
        <Parallax offset={8} className='absolute inset-0'>
          <div className='size-full bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]' />
        </Parallax>
      </div>

      <div className='relative w-full max-w-6xl text-center'>
        <div className='mb-8 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>
          <span>SYS / BLOG</span>
          <span className='hidden items-center gap-2 sm:flex'>
            <span className='size-1.5 rounded-full bg-lime' />
            ONLINE
          </span>
          <span>[ 01 ]</span>
        </div>

        <Badge variant='primary' className='mb-6 inline-flex items-center gap-4 px-6 py-1.5'>
          <span>New: AI feature integrated</span>
          <img src={assets.star_icon} className='w-2.5' alt='' />
        </Badge>

        <h1 className='font-display text-[clamp(3rem,10vw,9.5rem)] font-bold leading-[0.9] tracking-tighter text-ink'>
          <span className='block'>Your own</span>
          <span className='block bg-gradient-to-r from-primary via-cyan to-lime bg-clip-text text-transparent'>
            blogging
          </span>
          <span className='block'>platform.</span>
        </h1>

        <p className='mx-auto my-8 max-w-2xl text-sm text-muted sm:text-base'>
          This is your space to think out loud, to share what matters, and to write without filters.
          Whether it's one word or a thousand, your story starts right here.
        </p>

        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          hasSearchTerm={!!input}
        />
      </div>
    </section>
  )
}

export default Header
