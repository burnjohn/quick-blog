import React, { useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'
import { adminApi } from '../../../../api'
import { Button, Input, Panel } from '../../../ui'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../../constants/messages'

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
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Panel variant='strong' className='w-full max-w-sm p-6 sm:p-8 shadow-glow'>
        <p className='flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>
          <span className='size-1.5 rounded-full bg-lime' />
          SYS / ADMIN
        </p>
        <div className='py-6'>
          <h1 className='font-display text-4xl font-bold tracking-tighter leading-[0.95] text-ink'>
            Admin Login
          </h1>
          <p className='mt-3 font-light text-muted'>Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-5'>
          <Input
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='your email id'
            required
          />

          <Input
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='your password'
            required
          />

          <Button
            type='submit'
            variant='primary'
            fullWidth
            loading={loading}
            className='py-3'
          >
            Login
          </Button>
        </form>
      </Panel>
    </div>
  )
}

export default Login
