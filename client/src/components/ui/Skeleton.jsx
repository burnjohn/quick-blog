import { classNames } from '../../utils/helpers'

function Skeleton({ className = '', width, height, rounded = false }) {
  const style = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={classNames(
        'animate-pulse bg-line/60',
        rounded && 'rounded',
        className
      )}
      style={Object.keys(style).length > 0 ? style : undefined}
    />
  )
}

export default Skeleton
