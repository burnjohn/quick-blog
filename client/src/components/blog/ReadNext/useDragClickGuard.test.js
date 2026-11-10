import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDragClickGuard, DRAG_CLICK_THRESHOLD_PX } from './useDragClickGuard'

const clickEvent = (detail = 1) => ({
  detail,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
})

describe('useDragClickGuard', () => {
  it('lets a plain click through', () => {
    const { result } = renderHook(() => useDragClickGuard())
    const event = clickEvent()

    result.current.onPointerDown()
    result.current.onClickCapture(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('swallows the click that ends a swipe', () => {
    const { result } = renderHook(() => useDragClickGuard())
    const event = clickEvent()

    result.current.onPointerDown()
    result.current.onDragStart()
    result.current.onDrag(null, { offset: { x: -(DRAG_CLICK_THRESHOLD_PX + 40) } })
    result.current.onClickCapture(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.stopPropagation).toHaveBeenCalled()
  })

  it('does not block the next click (keyboard or pointer) after a swipe', () => {
    const { result } = renderHook(() => useDragClickGuard())

    result.current.onDrag(null, { offset: { x: 120 } })
    result.current.onClickCapture(clickEvent())

    const keyboardClick = clickEvent(0)
    result.current.onClickCapture(keyboardClick)
    expect(keyboardClick.preventDefault).not.toHaveBeenCalled()

    const pointerClick = clickEvent()
    result.current.onClickCapture(pointerClick)
    expect(pointerClick.preventDefault).not.toHaveBeenCalled()
  })

  it('never blocks keyboard activation, even right after a drag', () => {
    const { result } = renderHook(() => useDragClickGuard())
    const keyboardClick = clickEvent(0)

    result.current.onDrag(null, { offset: { x: 200 } })
    result.current.onClickCapture(keyboardClick)

    expect(keyboardClick.preventDefault).not.toHaveBeenCalled()
  })

  it('ignores tiny pointer jitter', () => {
    const { result } = renderHook(() => useDragClickGuard())
    const event = clickEvent()

    result.current.onDrag(null, { offset: { x: DRAG_CLICK_THRESHOLD_PX - 1 } })
    result.current.onClickCapture(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })
})
