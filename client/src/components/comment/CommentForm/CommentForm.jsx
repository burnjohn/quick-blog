import React, { useState } from 'react'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'
import Panel from '../../ui/Panel'

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
    <Panel className='mx-5 max-w-[72ch] p-6 sm:p-8 md:mx-auto'>
      <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted mb-5'>Add your comment</p>
      <form onSubmit={handleSubmit} className='flex flex-col items-start gap-4'>
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
    </Panel>
  )
}

export default CommentForm

