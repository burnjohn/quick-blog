import { useCallback, useMemo, useRef } from 'react'

// A pointer that moved further than this is a swipe, not a click on a card
export const DRAG_CLICK_THRESHOLD_PX = 6

// Swallows the single click that ends a swipe so dragging the carousel never
// opens a post. Keyboard activation (click with `detail === 0`) always passes,
// and the guard resets after each click so later clicks are never blocked.
export function useDragClickGuard() {
  const distance = useRef(0)

  const reset = useCallback(() => {
    distance.current = 0
  }, [])

  const onDrag = useCallback((_, info) => {
    distance.current = Math.max(distance.current, Math.abs(info?.offset?.x ?? 0))
  }, [])

  const onClickCapture = useCallback((event) => {
    const wasSwipe = distance.current > DRAG_CLICK_THRESHOLD_PX
    distance.current = 0
    if (wasSwipe && event.detail !== 0) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  return useMemo(
    () => ({ onPointerDown: reset, onDragStart: reset, onDrag, onClickCapture }),
    [reset, onDrag, onClickCapture]
  )
}
