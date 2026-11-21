import React, { useRef } from 'react'
import Button from '../../ui/Button'
import { classNames } from '../../../utils/helpers'

// `compact`: slim masthead variant (44px tall, small hard shadow, clear button inline)
const frames = {
  default: 'shadow-[6px_6px_0_0_var(--color-ink)] focus-within:shadow-[6px_6px_0_0_var(--color-signal)]',
  compact: 'shadow-hard-sm focus-within:shadow-[3px_3px_0_0_var(--color-signal)]'
}

function SearchBar({ onSearch, onClear, hasSearchTerm = false, compact = false }) {
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
    <div className={classNames('w-full', compact ? 'flex items-center gap-3' : 'max-w-xl')}>
      <form
        onSubmit={handleSubmit}
        role='search'
        className={classNames(
          'flex w-full min-w-0 items-stretch border border-ink bg-surface transition-shadow focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-ink',
          frames[compact ? 'compact' : 'default']
        )}
      >
        <span aria-hidden='true' className={classNames('items-center pl-4 font-mono text-sm text-ink-muted', compact ? 'hidden' : 'hidden sm:flex')}>
          /
        </span>
        <input
          ref={inputRef}
          type='search'
          aria-label='Search for blogs'
          placeholder='Search for blogs'
          required
          className={classNames(
            'w-full min-w-0 bg-transparent text-ink outline-none placeholder:text-ink-muted focus-visible:outline-none focus-visible:shadow-none',
            compact ? 'min-h-11 px-3 text-sm' : 'min-h-14 px-4 text-base'
          )}
        />
        <Button
          type='submit'
          variant='primary'
          size={compact ? 'sm' : 'md'}
          className={compact ? 'm-0.5 shrink-0' : 'm-1.5 shrink-0'}
        >
          Search
        </Button>
      </form>

      {hasSearchTerm && (
        <button
          type='button'
          onClick={handleClear}
          className={classNames(
            'inline-flex min-h-10 shrink-0 items-center gap-2 border-b-2 border-signal font-mono text-[11px] uppercase tracking-[0.14em] text-ink cursor-pointer hover:bg-signal transition-colors',
            !compact && 'mt-4'
          )}
        >
          <span aria-hidden='true'>✕</span> Clear Search
        </button>
      )}
    </div>
  )
}

export default SearchBar
