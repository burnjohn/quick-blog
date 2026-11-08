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
    <div className='max-w-3xl mx-auto px-5 md:px-0'>
      <h3 className='font-display text-2xl font-semibold text-foreground mb-6'>Add your comment</h3>
      <form onSubmit={handleSubmit} className='flex flex-col items-start gap-5 max-w-lg'>
        <Input
          type='text'
          label='Your name'
          placeholder='Name'
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
          loading={loading}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default CommentForm

