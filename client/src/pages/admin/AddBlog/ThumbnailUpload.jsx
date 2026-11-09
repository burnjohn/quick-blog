import React from 'react'
import { assets } from '../../../assets/assets'

function ThumbnailUpload({ image, onChange }) {
  return (
    <div>
      <p className='mb-2 font-mono text-xs uppercase tracking-[0.14em] text-muted'>
        Upload Thumbnail <span className='text-lime'>*</span>
      </p>
      <label
        htmlFor='image'
        className='flex w-fit cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.04] p-3 transition-colors hover:border-primary hover:bg-white/[0.06]'
      >
        <img
          src={!image ? assets.upload_area : URL.createObjectURL(image)}
          alt='Upload preview'
          className={`h-16 rounded-lg ${!image ? 'invert opacity-70' : ''}`}
        />
        <input
          onChange={onChange}
          type='file'
          id='image'
          hidden
          accept='image/*'
        />
      </label>
    </div>
  )
}

export default ThumbnailUpload
