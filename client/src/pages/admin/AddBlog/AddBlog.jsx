import React, { useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { assets } from '../../../assets/assets'
import { BLOG_CATEGORIES } from '../../../constants/categories'
import { Button, Input } from '../../../components/ui'
import { useBlogGenerator, useCreateBlog } from '../../../hooks'

function AddBlog() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: {
      title: '',
      subTitle: '',
      category: 'Startup',
      isPublished: false,
      image: null,
    }
  })

  const image = watch('image')
  const title = watch('title')

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const handleGenerateContent = async () => {
    const result = await generateContent(title)
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
    }
  }

  const onSubmit = async (data) => {
    if (!quillRef.current) return

    const description = quillRef.current.root.innerHTML
    if (!description || description.trim() === '<p><br></p>' || description.trim() === '') {
      toast.error('Please add blog description')
      return
    }

    const blog = {
      title: data.title,
      subTitle: data.subTitle,
      description,
      category: data.category,
      isPublished: data.isPublished
    }

    const result = await createBlog(blog, data.image)

    if (result.success) {
      reset()
      if (quillRef.current) {
        quillRef.current.root.innerHTML = ''
      }
    }
  }

  const onError = (fieldErrors) => {
    const firstError = Object.values(fieldErrors)[0]
    if (firstError?.message) {
      toast.error(firstError.message)
    }
  }

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
      className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'
    >
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        {/* Image Upload */}
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium'>
            Upload Thumbnail <span className='text-red-500'>*</span>
          </label>
          <Controller
            name='image'
            control={control}
            rules={{ validate: (v) => (v instanceof File) || 'Please select an image' }}
            render={({ field: { onChange } }) => (
              <label htmlFor='image' className='cursor-pointer'>
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : assets.upload_area}
                  alt='Upload preview'
                  className='mt-2 h-16 rounded hover:opacity-80 transition-opacity'
                />
                <input
                  onChange={(e) => onChange(e.target.files[0])}
                  type='file'
                  id='image'
                  hidden
                  accept='image/*'
                />
              </label>
            )}
          />
        </div>

        {/* Blog Title */}
        <Input
          label='Blog Title'
          type='text'
          placeholder='Type here'
          containerClassName='mb-6'
          {...register('title', { required: 'Please enter a blog title' })}
        />

        {/* Sub Title */}
        <Input
          label='Sub Title'
          type='text'
          placeholder='Type here'
          containerClassName='mb-6'
          {...register('subTitle', { required: 'Please enter a sub title' })}
        />

        {/* Blog Description with Quill Editor */}
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
              disabled={isGenerating || !title || isCreating}
              type='button'
              onClick={handleGenerateContent}
              className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>

        {/* Blog Category */}
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium'>
            Blog Category <span className='text-red-500'>*</span>
          </label>
          <select
            {...register('category', { required: 'Please select a category' })}
            className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full max-w-lg focus:border-primary transition-colors'
            disabled={isCreating}
          >
            {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Publish Checkbox */}
        <div className='flex items-center gap-2 mb-8'>
          <input
            type='checkbox'
            id='isPublished'
            className='scale-125 cursor-pointer'
            disabled={isCreating}
            {...register('isPublished')}
          />
          <label htmlFor='isPublished' className='cursor-pointer select-none'>
            Publish Now
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          variant='primary'
          loading={isCreating}
          disabled={isCreating || isGenerating}
          className='w-40'
        >
          Add Blog
        </Button>
      </div>
    </form>
  )
}

export default AddBlog
