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
        className='flex justify-between max-w-lg mx-auto border border-border bg-card rounded-full shadow-card overflow-hidden focus-within:ring-4 focus-within:ring-accent/25 focus-within:border-accent transition-shadow duration-200'
      >
        <input 
          ref={inputRef}
          type='text' 
          placeholder='Search for blogs' 
          required 
          aria-label='Search for blogs'
          className='w-full min-w-0 pl-5 bg-transparent text-foreground placeholder:text-muted-foreground outline-none'
        />
        <Button 
          type='submit' 
          variant='primary'
          className='m-1.5'
        >
          Search
        </Button>
      </form>
      
      {hasSearchTerm && (
        <div className='text-center mt-4'>
          <button 
            onClick={handleClear}
            className='border border-border bg-card text-muted-foreground text-xs py-1.5 px-4 rounded-full cursor-pointer hover:bg-muted hover:text-foreground transition-colors duration-200'
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchBar

