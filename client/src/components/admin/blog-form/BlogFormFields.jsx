import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '../../ui'
import { useFileUpload } from '../../../hooks'
import { assets } from '../../../assets/assets'

function BlogFormFields({ isSubmitting }) {
  const { register, control, formState: { errors } } = useFormContext()
  const { preview, handleFileChange, validationRules } = useFileUpload({ accept: 'image/*' })

  return (
    <>
      {/* Image Upload */}
      <div className='mb-6'>
        <label className='block mb-2 text-sm font-medium'>
          Upload Thumbnail <span className='text-red-500'>*</span>
        </label>
        <Controller
          name='image'
          control={control}
          rules={validationRules}
          render={({ field: { onChange, value } }) => (
            <>
              <label htmlFor='image' className='cursor-pointer'>
                <img 
                  src={preview || assets.upload_area} 
                  alt='Upload preview' 
                  className='mt-2 h-16 rounded hover:opacity-80 transition-opacity'
                />
                <input 
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      handleFileChange(file, onChange)
                    }
                  }}
                  type='file' 
                  id='image' 
                  hidden 
                  accept='image/*'
                  disabled={isSubmitting}
                />
              </label>
            </>
          )}
        />
        {errors.image && (
          <p className='mt-1 text-sm text-red-500'>{errors.image.message}</p>
        )}
      </div>

      {/* Blog Title */}
      <Input
        label='Blog Title'
        type='text'
        placeholder='Type here'
        containerClassName='mb-6'
        required
        error={errors.title?.message}
        disabled={isSubmitting}
        {...register('title', {
          required: 'Title is required',
          minLength: {
            value: 3,
            message: 'Title must be at least 3 characters'
          }
        })}
      />

      {/* Sub Title */}
      <Input
        label='Sub Title'
        type='text'
        placeholder='Type here'
        containerClassName='mb-6'
        required
        error={errors.subTitle?.message}
        disabled={isSubmitting}
        {...register('subTitle', {
          required: 'Sub title is required',
          minLength: {
            value: 5,
            message: 'Sub title must be at least 5 characters'
          }
        })}
      />
    </>
  )
}

export default BlogFormFields

