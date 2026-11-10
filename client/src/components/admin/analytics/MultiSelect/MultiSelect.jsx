import React, { useEffect, useId, useRef, useState } from 'react'
import { classNames } from '../../../../utils/helpers'

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet'

// Accessible checkbox popover. Arrow keys move between options, Escape closes
// and returns focus to the trigger, "Clear" resets the selection.
function MultiSelect({ label, options, selected, onChange, emptyText = 'No options' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const uid = useId()
  const panelId = `${uid}-panel`

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const toggleValue = (value) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  const focusItem = (index) => {
    const items = panelRef.current?.querySelectorAll('input[type="checkbox"]') ?? []
    if (items.length) items[(index + items.length) % items.length].focus()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    if (!open) {
      setOpen(true)
      return
    }
    const items = [...(panelRef.current?.querySelectorAll('input[type="checkbox"]') ?? [])]
    const current = items.indexOf(document.activeElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    focusItem(current === -1 ? (step === 1 ? 0 : -1) : current + step)
  }

  return (
    <div ref={rootRef} className='relative' onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type='button'
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup='true'
        onClick={() => setOpen((value) => !value)}
        className={classNames(
          'flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-ink-text backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20',
          FOCUS_RING
        )}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span
            aria-label={`${selected.length} selected`}
            className='rounded-full bg-accent-violet px-1.5 text-xs font-semibold tabular-nums text-ink-950'
          >
            {selected.length}
          </span>
        )}
        <span aria-hidden='true' className={classNames('text-ink-muted transition', open && 'rotate-180')}>
          ▾
        </span>
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role='group'
          aria-label={label}
          className='absolute left-0 z-30 mt-2 max-h-64 w-56 overflow-auto rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl'
        >
          {options.length === 0 && <p className='px-2 py-1 text-sm text-ink-muted'>{emptyText}</p>}
          {options.map((option) => (
            <label
              key={option.value}
              className='flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-text hover:bg-white/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-violet'
            >
              <input
                type='checkbox'
                checked={selected.includes(option.value)}
                onChange={() => toggleValue(option.value)}
                className='size-4 accent-violet-500'
              />
              {option.label}
            </label>
          ))}
          {selected.length > 0 && (
            <button
              type='button'
              onClick={() => onChange([])}
              className={classNames('mt-1 w-full rounded-lg px-2 py-1.5 text-left text-sm text-accent-cyan hover:bg-white/10', FOCUS_RING)}
            >
              Clear {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiSelect
