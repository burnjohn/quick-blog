import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '../../../constants/categories'
import { Button, Input, Panel } from '../../../components/ui'
import ThumbnailUpload from './ThumbnailUpload'
import DescriptionEditor from './DescriptionEditor'
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
      className='max-w-3xl p-4 md:p-10'
    >
      <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>SYS / NEW ENTRY</p>
      <h1 className='mb-6 mt-2 font-display text-3xl font-bold tracking-tighter text-ink'>Add Blog</h1>

      <Panel className='mb-4 space-y-6 p-5 md:p-8'>
        <ThumbnailUpload image={image} onChange={(e) => setImage(e.target.files[0])} />

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
      </Panel>

      <Panel className='mb-4 space-y-6 p-5 md:p-8'>
        <DescriptionEditor
          editorRef={editorRef}
          isGenerating={isGenerating}
          isCreating={isCreating}
          title={title}
          onGenerate={handleGenerateContent}
        />

        <div>
          <label htmlFor='category' className='mb-2 block font-mono text-xs uppercase tracking-[0.14em] text-muted'>
            Blog Category <span className='text-lime'>*</span>
          </label>
          <select
            id='category'
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            name='category'
            className='w-full max-w-lg rounded-xl border border-white/10 bg-surface px-4 py-3 text-ink outline-none transition-colors hover:border-white/20 focus:border-primary disabled:opacity-50'
            disabled={isCreating}
          >
            {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            id='isPublished'
            checked={isPublished}
            className='size-5 cursor-pointer accent-lime'
            onChange={(e) => setIsPublished(e.target.checked)}
            disabled={isCreating}
          />
          <label htmlFor='isPublished' className='cursor-pointer select-none text-ink'>
            Publish Now
          </label>
        </div>
      </Panel>

      <Button
        type='submit'
        variant='primary'
        loading={isCreating}
        disabled={isCreating || isGenerating}
        className='w-40'
      >
        Add Blog
      </Button>
    </form>
  )
}

export default AddBlog
