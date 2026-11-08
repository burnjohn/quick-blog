import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-background' role='status' aria-label='Loading'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-accent'></div>
    </div>
  )
}

export default Loader
