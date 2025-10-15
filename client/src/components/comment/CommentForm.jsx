import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

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
    <div className='max-w-3xl mx-auto'>
      <p className='font-semibold mb-4'>Add your comment</p>
      <form onSubmit={handleSubmit} className='flex flex-col items-start gap-4 max-w-lg'>
        <Input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <Textarea
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

