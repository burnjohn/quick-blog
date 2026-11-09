import React from 'react'
import { classNames } from '../../../utils/helpers'

const variants = {
  default: 'bg-white/[0.04] border-white/10',
  strong: 'bg-surface/70 border-white/10',
  accent: 'bg-gradient-to-br from-violet-deep/25 via-white/[0.03] to-cyan/10 border-primary/25',
}

// Glass surface: translucent fill, hairline border, backdrop blur.
function Panel({ as = 'div', variant = 'default', className = '', children, ...props }) {
  const Component = as

  return (
    <Component
      className={classNames('rounded-3xl border backdrop-blur-xl', variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Panel
