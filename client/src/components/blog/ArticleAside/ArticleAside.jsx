import React from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../utils/helpers'
import SocialShare from '../SocialShare'
import { padIndex } from '../helpers'
import { useActiveHeading } from './useActiveHeading'

const INDICATOR_SPRING = { type: 'spring', stiffness: 500, damping: 40 }

/** Article rail: in-article contents with the current section highlighted, plus sharing */
function ArticleAside({ headings }) {
  const activeId = useActiveHeading(headings.map((heading) => heading.id))
  const reduceMotion = useReducedMotion()

  const handleJump = (event, id) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <aside aria-label='Article tools' className='flex flex-col gap-8 lg:sticky lg:top-28'>
      {headings.length > 0 && (
        <nav aria-labelledby='contents-title' className='border border-ink bg-surface shadow-hard-sm'>
          <p id='contents-title' className='border-b border-ink bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>
            § In this story
          </p>
          <ol className='py-1'>
            {headings.map((heading, index) => {
              const isActive = heading.id === activeId
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(event) => handleJump(event, heading.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={classNames(
                      'relative flex min-h-11 items-baseline gap-3 px-4 py-2 text-sm leading-snug transition-colors focus-visible:outline-offset-[-3px]',
                      isActive ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId='contents-indicator'
                        aria-hidden='true'
                        transition={INDICATOR_SPRING}
                        className='absolute inset-y-0 left-0 w-1 bg-ink'
                      />
                    )}
                    <span className='font-mono text-[11px] tabular-nums'>{padIndex(index)}</span>
                    <span className={classNames(isActive && 'bg-signal px-1 -mx-1')}>{heading.text}</span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      <SocialShare title='Share this story' />
    </aside>
  )
}

export default ArticleAside
