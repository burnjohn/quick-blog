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
    <div className='w-full max-w-xl'>
      <form
        onSubmit={handleSubmit}
        role='search'
        className='flex w-full items-stretch border border-ink bg-surface shadow-[6px_6px_0_0_var(--color-ink)] transition-shadow focus-within:shadow-[6px_6px_0_0_var(--color-signal)] focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-ink'
      >
        <span aria-hidden='true' className='hidden items-center pl-4 font-mono text-sm text-ink-muted sm:flex'>
          /
        </span>
        <input
          ref={inputRef}
          type='search'
          aria-label='Search for blogs'
          placeholder='Search for blogs'
          required
          className='min-h-14 w-full min-w-0 bg-transparent px-4 text-base text-ink outline-none placeholder:text-ink-muted focus-visible:outline-none focus-visible:shadow-none'
        />
        <Button
          type='submit'
          variant='primary'
          className='m-1.5 shrink-0'
        >
          Search
        </Button>
      </form>

      {hasSearchTerm && (
        <button
          type='button'
          onClick={handleClear}
          className='mt-4 inline-flex min-h-10 items-center gap-2 border-b-2 border-signal font-mono text-[11px] uppercase tracking-[0.14em] text-ink cursor-pointer hover:bg-signal transition-colors'
        >
          <span aria-hidden='true'>✕</span> Clear Search
        </button>
      )}
    </div>
  )
}

export default SearchBar
