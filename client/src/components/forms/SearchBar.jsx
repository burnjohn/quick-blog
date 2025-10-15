import React, { useRef } from 'react'
import Button from '../ui/Button'

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
        className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'
      >
        <input 
          ref={inputRef}
          type='text' 
          placeholder='Search for blogs' 
          required 
          className='w-full pl-4 outline-none'
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
            className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer hover:bg-gray-50 transition-colors'
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchBar

