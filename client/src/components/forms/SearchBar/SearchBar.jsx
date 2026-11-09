import React, { useRef } from 'react'
import Button from '../../ui/Button'

function SearchBar({ onSearch, onClear, hasSearchTerm = false }) {
  const inputRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = inputRef.current.value
    if (value.trim()) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onClear()
  }

  return (
    <div>
      <form 
        onSubmit={handleSubmit} 
        className='mx-auto flex max-w-xl items-center justify-between overflow-hidden rounded-full border border-white/10 bg-white/[0.05] p-1.5 backdrop-blur-xl transition focus-within:border-primary/50 focus-within:shadow-glow'
      >
        <input 
          ref={inputRef}
          type='text' 
          placeholder='Search for blogs' 
          required 
          className='w-full min-w-0 bg-transparent pl-5 text-ink outline-none placeholder:text-muted'
        />
        <Button 
          type='submit' 
          variant='primary'
          className='shrink-0'
        >
          Search
        </Button>
      </form>
      
      {hasSearchTerm && (
        <div className='text-center mt-4'>
          <button 
            onClick={handleClear}
            className='cursor-pointer rounded-full border border-white/15 px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink transition-colors hover:border-lime hover:text-lime'
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchBar

