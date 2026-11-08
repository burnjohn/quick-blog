import React from 'react'

const Newsletter = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-muted-foreground pb-8'>Subscribe to get the latest blog, new tech, and exclusive news.</p>
      <form className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
        <input className='border border-input bg-card rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-foreground placeholder:text-muted-foreground' type="text" placeholder='Enter your email id' required/>
        <button type='submit' className='md:px-12 px-8 h-full text-accent-foreground bg-accent hover:bg-accent/90 transition-colors duration-200 cursor-pointer rounded-md rounded-l-none'>Subscribe</button>
      </form>
    </div>
  )
}

export default Newsletter
