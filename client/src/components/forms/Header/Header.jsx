import React from 'react'
import { assets } from '../../../assets/assets'
import { useAppContext } from '../../../context/AppContext'
import SearchBar from '../SearchBar'
import Badge from '../../ui/Badge'

function Header() {
  const { setInput, input } = useAppContext()

  const handleSearch = (searchTerm) => {
    setInput(searchTerm)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <section className='relative overflow-hidden bg-linear-to-b from-hero-from to-hero-to'>
      <div className='text-center pt-20 sm:pt-28 pb-12 px-6 sm:px-16 xl:px-24'>
        
        <Badge variant='primary' className='mb-6 inline-flex items-center gap-3 px-5 py-1.5'>
          <span>New: AI feature integrated</span>
          <img src={assets.star_icon} className='w-2.5' alt='' aria-hidden='true' />
        </Badge>

        <h1 className='font-display text-4xl sm:text-7xl font-bold tracking-tight leading-tight sm:leading-[1.1] text-foreground'>
          Your own <span className='italic text-accent'>blogging</span> <br /> platform.
        </h1>

        <p className='my-6 sm:my-8 max-w-2xl m-auto text-base sm:text-lg leading-relaxed text-muted-foreground'>
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
