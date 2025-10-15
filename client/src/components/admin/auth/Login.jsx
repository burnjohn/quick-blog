import React, { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { adminApi } from '../../../api'
import { Button, Input } from '../../ui'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'

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
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'>
              <span className='text-primary'>Admin</span> Login
            </h1>
            <p className='font-light'>Enter your credentials to access the admin panel</p>
          </div>
          
          <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
            <Input
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your email id'
              required
              className='border-b-2 border-gray-300 mb-6 rounded-none border-x-0 border-t-0'
            />
            
            <Input
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='your password'
              required
              className='border-b-2 border-gray-300 mb-6 rounded-none border-x-0 border-t-0'
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
        </div>
      </div>
    </div>
  )
}

export default Login
