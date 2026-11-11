import React, { useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'
import { adminApi } from '../../../../api'
import { Button, Input } from '../../../ui'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../../constants/messages'
import { assets } from '../../../../assets/assets'

function LoginAside() {
  return (
    <aside className='relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper md:flex md:w-1/2 lg:p-16'>
      <div className='flex items-center gap-3'>
        <img src={assets.logo_mark} alt='' className='h-10 w-10' />
        <span className='font-serif text-2xl font-semibold'>QuickBlog.</span>
      </div>
      <div>
        <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>Editor's desk</p>
        <p className='mt-6 font-serif text-6xl font-semibold leading-[0.95] tracking-tight lg:text-7xl'>
          Write. Edit.<br />
          <em className='font-normal text-signal'>Publish.</em>
        </p>
      </div>
      <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60'>
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
    <div className='flex min-h-dvh bg-paper text-ink'>
      <LoginAside />

      <main className='flex flex-1 items-center justify-center px-5 py-12 sm:px-10'>
        <div className='w-full max-w-md'>
          <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
            Restricted area
          </p>
          <h1 className='mt-4 font-serif text-5xl font-semibold tracking-tight sm:text-6xl'>
            <span className='bg-signal px-1'>Admin</span> Login
          </h1>
          <p className='mt-4 text-ink-muted'>Enter your credentials to access the admin panel</p>

          <form onSubmit={handleSubmit} className='mt-10 flex w-full flex-col gap-6'>
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
        </div>
      </main>
    </div>
  )
}

export default Login
