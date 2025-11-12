import React from 'react'
import { FormProvider } from 'react-hook-form'
import { useRHFForm } from '../../../hooks'
import { useCreateBlog } from '../../../hooks'
import { Button } from '../../ui'
import BlogFormFields from './BlogFormFields'
import BlogEditor from './BlogEditor'
import BlogMetadata from './BlogMetadata'

function AddBlogForm() {
  const methods = useRHFForm({
    defaultValues: {
      title: '',
      subTitle: '',
      description: '',
      category: 'Startup',
      isPublished: false,
      image: null
    }
  })

  const { handleSubmit, reset, formState: { isSubmitting } } = methods
  const { createBlog, isCreating } = useCreateBlog()

  const onSubmit = async (data) => {
    const blogData = {
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      category: data.category,
      isPublished: data.isPublished
    }

    const result = await createBlog(blogData, data.image)
    
    if (result.success) {
      reset()
    }
  }

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'
      >
        <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
          
          <BlogFormFields isSubmitting={isSubmitting || isCreating} />
          
          <BlogEditor isSubmitting={isSubmitting || isCreating} />
          
          <BlogMetadata isSubmitting={isSubmitting || isCreating} />

          {/* Submit Button */}
          <Button 
            type='submit' 
            variant='primary'
            loading={isCreating}
            disabled={isCreating || isSubmitting}
            className='w-40'
          >
            Add Blog
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default AddBlogForm

