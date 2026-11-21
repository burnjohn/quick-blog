import { useEffect, useState } from 'react'

// A section counts as "being read" once its heading passes 30% of the viewport height
const ACTIVATION_RATIO = 0.3

/** Tracks which article section is currently being read (last heading above the activation line). */
export function useActiveHeading(ids) {
  const [activeId, setActiveId] = useState(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!key) return undefined

    const ids = key.split('|')
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * ACTIVATION_RATIO
      // Look nodes up every time: the article body may re-mount and leave stale references
      const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
      const passed = elements.filter((element) => element.getBoundingClientRect().top <= line)
      setActiveId(passed.length > 0 ? passed[passed.length - 1].id : null)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [key])

  return activeId
}
