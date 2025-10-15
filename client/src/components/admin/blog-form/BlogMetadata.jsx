import React from 'react'
import { useFormContext } from 'react-hook-form'
import { BLOG_CATEGORIES } from '../../../constants/categories'

function BlogMetadata({ isSubmitting }) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <>
      {/* Blog Category */}
      <div className='mb-6'>
        <label className='block mb-2 text-sm font-medium'>
          Blog Category <span className='text-red-500'>*</span>
        </label>
        <select 
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full max-w-lg focus:border-primary transition-colors'
          disabled={isSubmitting}
          {...register('category', {
            required: 'Category is required'
          })}
        >
          {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
        {errors.category && (
          <p className='mt-1 text-sm text-red-500'>{errors.category.message}</p>
        )}
      </div>

      {/* Publish Checkbox */}
      <div className='flex items-center gap-2 mb-8'>
        <input 
          type='checkbox' 
          id='isPublished'
          className='scale-125 cursor-pointer' 
          disabled={isSubmitting}
          {...register('isPublished')}
        />
        <label htmlFor='isPublished' className='cursor-pointer select-none'>
          Publish Now
        </label>
      </div>
    </>
  )
}

export default BlogMetadata

