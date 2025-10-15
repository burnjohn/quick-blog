import React from 'react'
import { classNames } from '../../utils/helpers'

function Section({ children, className = '', ...props }) {
  return (
    <section 
      className={classNames('py-10', className)}
      {...props}
    >
      {children}
    </section>
  )
}

export default Section

