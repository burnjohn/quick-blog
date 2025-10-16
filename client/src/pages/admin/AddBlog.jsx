import React from 'react'
import { Button } from '../../components/ui'
import { useBlogForm, useBlogGenerator, useCreateBlog } from '../../hooks'
import {
  BlogTitleField,
  BlogSubTitleField,
  BlogImageUploadField,
  BlogDescriptionField,
  BlogCategoryField,
  BlogPublishField
} from '../../components/forms/blog'

function AddBlog() {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    title,
    formState: { errors }
  } = useBlogForm()

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const onSubmitHandler = async (data) => {
    const blog = {
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      category: data.category,
      isPublished: data.isPublished
    }

    const result = await createBlog(blog, data.image)

    if (result.success) {
      reset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'
    >
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        
        <BlogImageUploadField 
          control={control} 
          error={errors.image?.message} 
        />
        
        <BlogTitleField 
          control={control} 
          error={errors.title?.message} 
        />
        
        <BlogSubTitleField 
          control={control} 
          error={errors.subTitle?.message} 
        />
        
        <BlogDescriptionField
          control={control}
          error={errors.description?.message}
          setValue={setValue}
          onGenerateClick={generateContent}
          isGenerating={isGenerating}
          title={title}
          isSubmitting={isCreating}
        />
        
        <BlogCategoryField
          control={control}
          error={errors.category?.message}
          disabled={isCreating}
        />
        
        <BlogPublishField 
          control={control} 
          disabled={isCreating} 
        />

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

