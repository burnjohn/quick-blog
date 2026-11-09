import React, { useState } from 'react'
import Button from '../../ui/Button'
import Panel from '../../ui/Panel'
import { Reveal } from '../../effects'
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
    <Reveal className='mx-auto my-24 max-w-5xl px-6 sm:px-10'>
      <Panel variant='accent' className='px-6 py-14 text-center sm:px-12'>
        <p className='mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>[ 03 ] NEWSLETTER</p>
        <h2 className='font-display text-3xl font-bold tracking-tighter text-ink md:text-5xl'>Never Miss a Blog!</h2>
        <p className='mx-auto mt-4 max-w-xl pb-8 text-muted md:text-lg'>
          Subscribe to get the latest blog, new tech, and exclusive news.
        </p>

        <form
          onSubmit={handleSubmit}
          className='mx-auto flex w-full max-w-2xl items-center justify-between overflow-hidden rounded-full border border-white/10 bg-void/40 p-1.5 md:h-16 h-14 transition-shadow focus-within:border-primary/50 focus-within:shadow-glow focus-within:ring-2 focus-within:ring-lime/70'
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email id'
            aria-label='Email address'
            required
            className='h-full w-full min-w-0 bg-transparent px-4 text-ink outline-none placeholder:text-muted'
          />
          <Button
            type='submit'
            variant='primary'
            loading={loading}
            className='h-full shrink-0'
          >
            Subscribe
          </Button>
        </form>
      </Panel>
    </Reveal>
  )
}

export default NewsletterForm
