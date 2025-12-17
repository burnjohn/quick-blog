import React, { useState } from 'react'
import { useSubmitComment } from '../../hooks'

function CommentForm({ blogId, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', comment: '' })
  const [errors, setErrors] = useState({})
  const { submitComment } = useSubmitComment()

  const validate = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else {
      const trimmedName = formData.name.trim()
      if (trimmedName.length < 2 || trimmedName.length > 100) {
        newErrors.name = 'Name must be 2-100 characters'
      }
    }

    // Comment validation
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required'
    } else {
      const trimmedComment = formData.comment.trim()
      if (trimmedComment.length < 10 || trimmedComment.length > 1000) {
        newErrors.comment = 'Comment must be 10-1000 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await submitComment(blogId, formData)
    if (result.success) {
      setFormData({ name: '', comment: '' })
      setErrors({})
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <div className='mt-8 p-6 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900'>Add your comment</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              if (errors.name) setErrors({ ...errors, name: '' })
            }}
            placeholder='Name'
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-500'>{errors.name}</p>
          )}
        </div>

        <div>
          <textarea
            value={formData.comment}
            onChange={(e) => {
              setFormData({ ...formData, comment: e.target.value })
              if (errors.comment) setErrors({ ...errors, comment: '' })
            }}
            placeholder='Comment'
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
              errors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.comment && (
            <p className='mt-1 text-sm text-red-500'>{errors.comment}</p>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default CommentForm

