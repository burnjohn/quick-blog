import React, { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useQuillEditor } from '../../../hooks'
import { useBlogGenerator } from '../../../hooks'

function BlogEditor({ isSubmitting }) {
  const { control, formState: { errors }, watch, setValue } = useFormContext()
  const { generateContent, isGenerating } = useBlogGenerator()
  const onChangeRef = useRef(null)

  const title = watch('title')

  // Initialize Quill with onChange callback
  const { editorRef, setContent } = useQuillEditor({}, (html) => {
    if (onChangeRef.current) {
      onChangeRef.current(html)
    }
  })

  const handleGenerateContent = async () => {
    const result = await generateContent(title)
    if (result.success && result.content) {
      setContent(result.content)
      setValue('description', result.content)
    }
  }

  return (
    <div className='mb-6'>
      <label className='block mb-2 text-sm font-medium'>
        Blog Description <span className='text-red-500'>*</span>
      </label>
      <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
        <Controller
          name='description'
          control={control}
          rules={{
            required: 'Description is required',
            validate: (value) => {
              const isEmpty = !value || value.trim() === '<p><br></p>' || value.trim() === ''
              return isEmpty ? 'Please add blog description' : true
            }
          }}
          render={({ field: { onChange } }) => {
            // Store onChange in ref so Quill can call it
            onChangeRef.current = onChange
            return <div ref={editorRef}></div>
          }}
        />
        
        {isGenerating && (
          <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2 rounded'>
            <div className='w-8 h-8 rounded-full border-2 border-t-white border-gray-300 animate-spin'></div>
          </div>
        )}
        
        <button 
          disabled={isGenerating || !title || isSubmitting} 
          type='button' 
          onClick={handleGenerateContent} 
          className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>
      
      {errors.description && (
        <p className='mt-1 text-sm text-red-500'>{errors.description.message}</p>
      )}
    </div>
  )
}

export default BlogEditor

