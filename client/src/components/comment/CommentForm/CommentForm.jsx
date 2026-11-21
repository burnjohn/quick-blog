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
    <div className='relative border border-ink bg-surface p-6 shadow-hard sm:p-8'>
      <span aria-hidden='true' className='absolute -top-4 right-5 -rotate-3 border-2 border-ink bg-signal px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink'>
        Letters to the editor
      </span>
      <h2 className='font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl'>
        Add your comment
      </h2>
      <p className='mt-2 text-sm text-ink-muted'>Comments appear once approved by the editor.</p>
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
