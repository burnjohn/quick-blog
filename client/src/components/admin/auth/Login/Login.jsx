import React, { useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'
import { adminApi } from '../../../../api'
import { Button, Input } from '../../../ui'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../../constants/messages'
import { assets } from '../../../../assets/assets'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL, riseIn } from '../../shared/motion'

const HEADLINE = ['Write.', 'Edit.', 'Publish.']

const headlineLine = {
  hidden: { opacity: 0, y: 28 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_EDITORIAL, delay: 0.1 + index * 0.08 }
  })
}

function LoginAside() {
  return (
    <aside className='relative flex flex-col justify-between gap-10 overflow-hidden bg-ink px-6 py-8 text-paper sm:px-10 md:w-1/2 md:p-12 lg:p-16'>
      <div aria-hidden='true' className='halftone-signal pointer-events-none absolute -right-16 bottom-0 h-2/3 w-2/3 opacity-50 [mask-image:radial-gradient(circle_at_70%_80%,#000,transparent_70%)]' />

      <div className='relative flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 pb-4'>
        <div className='flex items-center gap-3'>
          <img src={assets.logo_mark} alt='' className='h-10 w-10' />
          <span className='font-serif text-2xl font-semibold'>QuickBlog<span className='text-signal'>.</span></span>
        </div>
        <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60'>Editor&apos;s desk · Vol. 1</p>
      </div>

      <div className='relative'>
        <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>§ Restricted edition</p>
        <motion.p
          initial='hidden'
          animate='show'
          className='mt-6 font-serif text-[clamp(64px,9vw,148px)] font-semibold leading-[0.85] tracking-tight'
        >
          {HEADLINE.map((word, index) => (
            <motion.span
              key={word}
              custom={index}
              variants={headlineLine}
              className={index === HEADLINE.length - 1 ? 'block italic font-normal text-signal' : 'block'}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
        <motion.span
          initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
          animate={{ opacity: 1, scale: 1, rotate: -3, transition: { delay: 0.6, type: 'spring', stiffness: 380, damping: 18 } }}
          className='mt-8 inline-block border-2 border-paper bg-signal px-3 py-1.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-ink'
        >
          Staff only
        </motion.span>
      </div>

      <p className='relative max-w-sm font-serif text-lg italic text-paper/70 max-md:hidden'>
        Manage stories, comments and drafts in one place.
      </p>
    </aside>
  )
}

function Login() {
  const { setToken } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await adminApi.login({ email, password })

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
        toast.success(MESSAGES.SUCCESS_LOGIN)
      } else {
        toast.error(response.data.message || MESSAGES.ERROR_LOGIN)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || MESSAGES.ERROR_LOGIN)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-dvh flex-col bg-paper text-ink md:flex-row'>
      <LoginAside />

      <main className='flex flex-1 items-center justify-center px-5 py-12 sm:px-10'>
        <motion.div initial='hidden' animate='show' variants={riseIn} custom={2} className='w-full max-w-md'>
          <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
            Restricted area
          </p>
          <h1 className='mt-4 font-serif text-5xl font-semibold leading-none tracking-tight sm:text-6xl'>
            <span className='bg-signal px-1'>Admin</span> Login
          </h1>
          <p className='mt-4 text-ink-muted'>Enter your credentials to access the admin panel</p>

          <form onSubmit={handleSubmit} className='mt-10 flex w-full flex-col gap-6 border border-ink bg-surface p-6 shadow-hard sm:p-8'>
            <Input
              label='Email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your email id'
              required
            />

            <Input
              label='Password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='your password'
              required
            />

            <Button
              type='submit'
              variant='primary'
              size='lg'
              fullWidth
              loading={loading}
              className='mt-2'
            >
              Login
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

export default Login
