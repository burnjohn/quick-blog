import React, { useState } from 'react'
import Button from '../ui/Button'
import toast from 'react-hot-toast'
import { validateEmail } from '../../utils/validators'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-gray-500/70 pb-8'>
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>
      
      <form 
        onSubmit={handleSubmit}
        className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'
      >
        <input 
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email id' 
          required
          className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500'
        />
        <Button
          type='submit'
          variant='primary'
          loading={loading}
          className='h-full rounded-l-none bg-primary/80 hover:bg-primary'
        >
          Subscribe
        </Button>
      </form>
    </div>
  )
}

export default NewsletterForm

