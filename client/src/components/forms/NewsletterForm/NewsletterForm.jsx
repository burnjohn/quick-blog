import React, { useState } from 'react'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import { validateEmail } from '../../../utils/validators'

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
    <section className='mx-6 sm:mx-16 xl:mx-32 my-24 sm:my-32 rounded-3xl border border-border bg-card px-6 py-14 sm:py-20 flex flex-col items-center justify-center text-center space-y-3 shadow-card'>
      <h2 className='font-display md:text-5xl text-3xl font-bold tracking-tight text-foreground'>Never Miss a Blog!</h2>
      <p className='md:text-lg text-muted-foreground pb-6'>
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>
      
      <form 
        onSubmit={handleSubmit}
        className='flex flex-col sm:flex-row items-stretch gap-3 max-w-xl w-full'
      >
        <input 
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email id' 
          required
          aria-label='Email address'
          className='w-full h-12 rounded-full border border-input bg-background px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-4 focus:ring-accent/40 transition-colors duration-200'
        />
        <Button
          type='submit'
          variant='primary'
          loading={loading}
          className='h-12 shrink-0'
        >
          Subscribe
        </Button>
      </form>
    </section>
  )
}

export default NewsletterForm

