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
    <section aria-labelledby='newsletter-title' className='bg-ink text-paper'>
      <div className='mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:items-end'>
        <div className='lg:col-span-7'>
          <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>
            The newsletter
          </p>
          <h2 id='newsletter-title' className='mt-5 font-serif text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl'>
            Never miss <em className='font-normal text-signal'>a blog!</em>
          </h2>
          <p className='mt-6 max-w-lg text-lg leading-relaxed text-paper/70'>
            Subscribe to get the latest blog, new tech, and exclusive news.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className='lg:col-span-5'
        >
          <label htmlFor='newsletter-email' className='mb-3 block font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70'>
            Email address
          </label>
          <div className='flex flex-col gap-3 sm:flex-row sm:gap-0'>
            <input
              id='newsletter-email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email id'
              required
              className='min-h-14 w-full min-w-0 border border-paper/40 bg-transparent px-4 text-base text-paper outline-none transition-colors placeholder:text-paper/40 hover:border-paper focus:border-signal'
            />
            <Button
              type='submit'
              variant='accent'
              size='lg'
              loading={loading}
              className='shrink-0 border-signal'
            >
              Subscribe
            </Button>
          </div>
          <p className='mt-3 text-xs text-paper/50'>One email a week. Unsubscribe any time.</p>
        </form>
      </div>
    </section>
  )
}

export default NewsletterForm
