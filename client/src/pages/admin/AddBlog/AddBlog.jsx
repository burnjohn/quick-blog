import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '../../../constants/categories'
import { Button, Input } from '../../../components/ui'
import { AdminPageHeader, CoverUpload } from '../../../components/admin'
import { useBlogGenerator, useCreateBlog } from '../../../hooks'

function AddBlog() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const handleGenerateContent = async () => {
    const result = await generateContent(title)
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!quillRef.current) return

    // Validate all required fields
    if (!title || !title.trim()) {
      toast.error('Please enter a blog title')
      return
    }

    if (!subTitle || !subTitle.trim()) {
      toast.error('Please enter a sub title')
      return
    }

    if (!image || image === false) {
      toast.error('Please select an image')
      return
    }

    if (!category || category === '') {
      toast.error('Please select a category')
      return
    }

    const description = quillRef.current.root.innerHTML
    if (!description || description.trim() === '<p><br></p>' || description.trim() === '') {
      toast.error('Please add blog description')
      return
    }

    // Debug logging
    console.log('Form submission:', {
      title,
      subTitle,
      category,
      isPublished,
      imageType: typeof image,
      imageFile: image,
      imageName: image?.name,
      imageSize: image?.size
    })

    const blog = {
      title,
      subTitle,
      description,
      category,
      isPublished
    }

    const result = await createBlog(blog, image)

    if (result.success) {
      // Reset form
      setImage(false)
      setTitle('')
      setSubTitle('')
      quillRef.current.root.innerHTML = ''
      setCategory('Startup')
      setIsPublished(false)
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
      onSubmit={onSubmitHandler}
      noValidate
      className='min-h-full bg-paper p-5 md:p-10'
    >
      <AdminPageHeader eyebrow='New story' title='Add Blog' />

      <div className='flex w-full max-w-3xl flex-col gap-7 border border-ink bg-surface p-5 md:p-10'>
        <CoverUpload image={image} onChange={setImage} />

        <Input
          label='Blog Title'
          type='text'
          placeholder='Type here'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label='Sub Title'
          type='text'
          placeholder='Type here'
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />

        {/* Blog Description with Quill Editor */}
        <div>
          <p className='mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink'>
            Blog Description <span className='text-danger' aria-hidden='true'>*</span>
          </p>
          <div className='relative h-80 pb-16 sm:pb-10'>
            <div ref={editorRef}></div>
            {isGenerating && (
              <div className='absolute inset-0 flex items-center justify-center bg-ink/10'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent'></div>
              </div>
            )}
            <button 
              disabled={isGenerating || !title || isCreating} 
              type='button' 
              onClick={handleGenerateContent} 
              className='absolute bottom-1 right-2 min-h-10 border border-ink bg-signal px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink cursor-pointer transition-colors hover:bg-ink hover:text-signal disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isGenerating ? 'Generating...' : '✦ Generate with AI'}
            </button>
          </div>
        </div>

        {/* Blog Category */}
        <div>
          <label htmlFor='category' className='mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink'>
            Blog Category <span className='text-danger' aria-hidden='true'>*</span>
          </label>
          <select 
            id='category'
            onChange={(e) => setCategory(e.target.value)} 
            value={category}
            name='category' 
            className='min-h-12 w-full max-w-sm border border-line bg-surface px-3 text-ink outline-none transition-colors hover:border-ink focus:border-ink'
            disabled={isCreating}
          >
            {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Publish Checkbox */}
        <div className='flex items-center gap-3'>
          <input 
            type='checkbox' 
            id='isPublished'
            checked={isPublished} 
            className='h-5 w-5 cursor-pointer accent-ink' 
            onChange={(e) => setIsPublished(e.target.checked)}
            disabled={isCreating}
          />
          <label htmlFor='isPublished' className='cursor-pointer select-none text-ink'>
            Publish Now
          </label>
        </div>

        <Button 
          type='submit' 
          variant='primary'
          size='lg'
          loading={isCreating}
          disabled={isCreating || isGenerating}
          className='self-start'
        >
          Add Blog
        </Button>
      </div>
    </form>
  )
}

export default AddBlog
