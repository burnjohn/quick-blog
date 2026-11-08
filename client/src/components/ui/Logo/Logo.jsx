import React from 'react'
import { assets } from '../../../assets/assets'
import { classNames } from '../../../utils/helpers'

/**
 * Brand logo that swaps to the light-on-dark artwork in dark theme.
 * Only the light-theme image carries alt text, so the logo is announced once.
 */
function Logo({ className = '', alt = 'logo' }) {
  return (
    <>
      <img src={assets.logo} alt={alt} className={classNames('dark:hidden', className)} />
      <img src={assets.logo_light} alt='' aria-hidden='true' className={classNames('hidden dark:block', className)} />
    </>
  )
}

export default Logo
