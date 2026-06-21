import React from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'

function CommentForm({ onSubmit, loading = false }) {
  const { register, handleSubmit, reset } = useForm()

  const onFormSubmit = async (data) => {
    const result = await onSubmit(data)

    if (result?.success) {
      reset()
    }
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <p className='font-semibold mb-4'>Add your comment</p>
      <form onSubmit={handleSubmit(onFormSubmit)} className='flex flex-col items-start gap-4 max-w-lg'>
        <Input
          type='text'
          placeholder='Name'
          required
          {...register('name', { required: true })}
        />

        <Textarea
          placeholder='Comment'
          rows={6}
          required
          {...register('content', { required: true })}
        />

        <Button
          type='submit'
          variant='primary'
          loading={loading}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default CommentForm

