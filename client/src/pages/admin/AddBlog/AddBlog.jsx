import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { Button, Input } from '../../../components/ui'
import { AdminPageHeader, CoverUpload } from '../../../components/admin'
import AiDraftButton, { AiDraftOverlay } from '../../../components/admin/blog/AiDraftButton'
import CategorySelect from '../../../components/admin/blog/CategorySelect'
import PublishToggle from '../../../components/admin/blog/PublishToggle'
import { riseIn } from '../../../components/admin/shared/motion'
import { useBlogGenerator, useCreateBlog } from '../../../hooks'
import { classNames } from '../../../utils/helpers'

const KICKER_CLASS = 'section-no font-mono text-[11px] uppercase tracking-[0.18em]'

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
      className='section-counter min-h-full bg-paper p-5 md:p-10'
    >
      <AdminPageHeader eyebrow='New story' title='Add Blog'>
        <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
          {isPublished ? 'Filing to the front page' : 'Filing as draft'}
        </p>
      </AdminPageHeader>

      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10'>
        <motion.div
          variants={riseIn}
          custom={1}
          initial='hidden'
          animate='show'
          className='flex min-w-0 flex-col gap-7 border border-ink bg-surface p-5 shadow-hard md:p-8'
        >
          <p className={classNames(KICKER_CLASS, 'text-ink')}>Headline</p>

          <Input
            label='Blog Title'
            type='text'
            placeholder='Type here'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='font-serif text-2xl font-semibold'
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
            <div className='mb-3 flex flex-wrap items-end justify-between gap-3'>
              <p className='font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink'>
                Blog Description <span className='text-danger' aria-hidden='true'>*</span>
              </p>
              <AiDraftButton
                onClick={handleGenerateContent}
                disabled={isGenerating || !title || isCreating}
                isGenerating={isGenerating}
                hintId='ai-draft-hint'
              />
            </div>
            <p id='ai-draft-hint' className='mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted'>
              {title ? 'AI drafts the body from your headline' : 'Write a headline first to enable AI drafting'}
            </p>
            <div className='relative h-96 pb-12 sm:pb-10'>
              <div ref={editorRef}></div>
              <AiDraftOverlay isGenerating={isGenerating} />
            </div>
          </div>
        </motion.div>

        <motion.aside
          variants={riseIn}
          custom={2}
          initial='hidden'
          animate='show'
          aria-label='Publishing'
          className='flex flex-col gap-7 bg-ink p-5 text-paper shadow-hard-signal md:p-7 lg:sticky lg:top-6'
        >
          <p className={classNames(KICKER_CLASS, 'text-paper/70')}>Cover &amp; filing</p>

          <CoverUpload image={image} onChange={setImage} />

          <CategorySelect value={category} onChange={setCategory} disabled={isCreating} />

          <PublishToggle checked={isPublished} onChange={setIsPublished} disabled={isCreating} />

          <Button
            type='submit'
            variant='accent'
            size='lg'
            fullWidth
            loading={isCreating}
            disabled={isCreating || isGenerating}
            className='hover:ring-2 hover:ring-signal'
          >
            Add Blog
          </Button>
        </motion.aside>
      </div>
    </form>
  )
}

export default AddBlog
