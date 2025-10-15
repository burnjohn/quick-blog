import React from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import SearchBar from './SearchBar'
import Badge from '../ui/Badge'

function Header() {
  const { setInput, input } = useAppContext()

  const handleSearch = (searchTerm) => {
    setInput(searchTerm)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
      <div className='text-center mt-20 mb-8'>
        
        <Badge variant='primary' className='mb-4 inline-flex items-center gap-4 px-6 py-1.5'>
          <span>New: AI feature integrated</span>
          <img src={assets.star_icon} className='w-2.5' alt='' />
        </Badge>

        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>
          Your own <span className='text-primary'>blogging</span> <br /> platform.
        </h1>

        <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
          This is your space to think out loud, to share what matters, and to write without filters. 
          Whether it's one word or a thousand, your story starts right here.
        </p>

        <SearchBar 
          onSearch={handleSearch}
          onClear={handleClear}
          hasSearchTerm={!!input}
        />
      </div>

      <img 
        src={assets.gradientBackground} 
        alt='' 
        className='absolute -top-50 -z-1 opacity-50'
      />
    </div>
  )
}

export default Header
