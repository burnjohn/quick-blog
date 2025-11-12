import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { commentFormSchema } from '../../utils/validators'

function CommentForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: '',
      content: ''
    }
  })

  const onSubmitForm = async (data) => {
    const result = await onSubmit(data)
    
    if (result?.success) {
      reset()
    }
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <p className='font-semibold mb-4'>Add your comment</p>
      <form onSubmit={handleSubmit(onSubmitForm)} className='flex flex-col items-start gap-4 max-w-lg'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <Input
              type='text'
              placeholder='Name'
              error={errors.name?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name='content'
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder='Comment'
              rows={6}
              error={errors.content?.message}
              {...field}
            />
          )}
        />
        
        <Button 
          type='submit' 
          variant='primary'
          loading={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default CommentForm

