import React from 'react'

// Decorative, fixed backdrop shared by every route: drifting aurora blobs, a fine grid and film grain.
// Drift is pure CSS, so the reduced-motion media query in index.css freezes it.
function AuroraBackground() {
  return (
    <div aria-hidden='true' className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
      <div className='absolute -top-[20%] -left-[10%] h-[60vmax] w-[60vmax] rounded-full bg-violet-deep/35 blur-[120px] animate-aurora' />
      <div className='absolute top-[10%] -right-[15%] h-[50vmax] w-[50vmax] rounded-full bg-cyan/20 blur-[130px] animate-aurora-slow' />
      <div className='absolute -bottom-[25%] left-[25%] h-[45vmax] w-[45vmax] rounded-full bg-primary/15 blur-[140px] animate-aurora' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]' />
      <div className='grain absolute inset-0 opacity-[0.07] mix-blend-overlay' />
    </div>
  )
}

export default AuroraBackground
