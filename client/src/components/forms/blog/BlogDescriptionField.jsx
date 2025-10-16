import { useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form'
import Quill from 'quill'

function BlogDescriptionField({ 
  control, 
  error, 
  setValue, 
  onGenerateClick, 
  isGenerating, 
  title,
  isSubmitting 
}) {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
      
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML
        setValue('description', html, { shouldValidate: false })
      })
    }
  }, [setValue])

  const handleGenerate = async () => {
    const result = await onGenerateClick(title)
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
      setValue('description', result.content, { shouldValidate: true })
    }
  }

  return (
    <Controller
      name='description'
      control={control}
      render={({ field }) => (
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium'>
            Blog Description <span className='text-red-500'>*</span>
          </label>
          <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
            <div ref={editorRef}></div>
            {isGenerating && (
              <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2 rounded'>
                <div className='w-8 h-8 rounded-full border-2 border-t-white border-gray-300 animate-spin'></div>
              </div>
            )}
            <button
              disabled={isGenerating || !title || isSubmitting}
              type='button'
              onClick={handleGenerate}
              className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>
      )}
    />
  )
}

export { BlogDescriptionField }

