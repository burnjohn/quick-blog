import React, { useState } from 'react'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'

function CommentForm({ onSubmit, loading = false }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await onSubmit({ name, content })

    if (result?.success) {
      setName('')
      setContent('')
    }
  }

  return (
    <div className='border border-ink bg-surface p-6 sm:p-8'>
      <h2 className='font-serif text-3xl font-semibold tracking-tight text-ink'>
        Add your comment
      </h2>
      <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-5'>
        <Input
          label='Your name'
          type='text'
          placeholder='Name'
          autoComplete='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Textarea
          label='Your comment'
          placeholder='Comment'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
        />

        <Button
          type='submit'
          variant='primary'
          size='lg'
          loading={loading}
          className='self-start'
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default CommentForm
