import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import { validateEmail } from '../../../utils/validators'

function NewsletterForm() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!')
      reset()
      setLoading(false)
    }, 1000)
  }

  const onError = (fieldErrors) => {
    const firstError = Object.values(fieldErrors)[0]
    if (firstError?.message) {
      toast.error(firstError.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-gray-500/70 pb-8'>
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'
      >
        <input
          type='email'
          placeholder='Enter your email id'
          className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500'
          {...register('email', {
            required: 'Please enter an email address',
            validate: (value) => validateEmail(value) || 'Please enter a valid email address'
          })}
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

