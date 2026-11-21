import React, { useState } from 'react'
import Button from '../../ui/Button'
import Reveal from '../../ui/Reveal'
import Sticker from '../../ui/Sticker'
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
    <section aria-labelledby='newsletter-title' className='relative overflow-hidden border-t-2 border-ink bg-surface'>
      {/* Signal is an accent here, not the surface: one halftone corner + one highlighted phrase */}
      <span aria-hidden='true' className='halftone pointer-events-none absolute -left-20 -top-20 h-56 w-56 rotate-12 border-2 border-ink opacity-80' />
      <div className='relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:items-center'>
        <Reveal className='lg:col-span-7'>
          <p className='inline-block bg-ink px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>
            The newsletter
          </p>
          <h2 id='newsletter-title' className='mt-6 font-serif text-6xl font-semibold leading-[0.9] tracking-tight text-ink sm:text-8xl'>
            Never miss{' '}
            <em className='bg-signal box-decoration-clone px-1 font-normal'>a blog!</em>
          </h2>
          <p className='mt-6 max-w-lg text-lg leading-relaxed text-ink-muted'>
            Subscribe to get the latest blog, new tech, and exclusive news.
          </p>
        </Reveal>

        <Reveal index={1} className='lg:col-span-5'>
          <form
            onSubmit={handleSubmit}
            noValidate
            className='relative border border-ink bg-ink p-6 text-paper shadow-hard sm:p-8'
          >
            <Sticker tilt='right' tone='paper' className='absolute -right-3 -top-4'>Free · weekly</Sticker>
            <label htmlFor='newsletter-email' className='mb-3 block font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70'>
              Email address
            </label>
            <div className='flex flex-col gap-3'>
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
                fullWidth
                className='border-signal'
              >
                Subscribe <span aria-hidden='true'>→</span>
              </Button>
            </div>
            <p className='mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50'>One email a week. Unsubscribe any time.</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default NewsletterForm
