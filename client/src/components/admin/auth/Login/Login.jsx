import React, { useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'
import { adminApi } from '../../../../api'
import { Button, Input, ThemeToggle } from '../../../ui'
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
    <div className='relative flex items-center justify-center min-h-screen px-6 bg-linear-to-b from-hero-from to-hero-to'>
      <ThemeToggle className='absolute top-5 right-5' />
      <div className='w-full max-w-sm p-8 bg-card text-card-foreground border border-border shadow-card rounded-3xl'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
            <h1 className='font-display text-3xl font-bold tracking-tight'>
              <span className='text-accent'>Admin</span> Login
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>Enter your credentials to access the admin panel</p>
          </div>
          
          <form onSubmit={handleSubmit} className='mt-4 w-full sm:max-w-md space-y-5'>
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
              className='py-3 mt-2'
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
