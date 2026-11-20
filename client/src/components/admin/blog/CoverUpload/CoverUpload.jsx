import React from 'react'

// Cover picker styled for the ink publish panel.
function CoverUpload({ image, onChange, disabled = false }) {
  return (
    <div>
      <p className='mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-paper'>
        Upload Thumbnail <span className='text-signal' aria-hidden='true'>*</span>
      </p>
      <label
        htmlFor='image'
        className='group block cursor-pointer border border-dashed border-paper/50 p-3 transition-colors hover:border-signal has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-signal'
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt='Upload preview'
            className='aspect-[16/10] w-full border border-paper object-cover'
          />
        ) : (
          <span
            aria-hidden='true'
            className='halftone-signal flex aspect-[16/10] w-full items-center justify-center border border-paper/30 transition-colors group-hover:bg-paper/5'
          >
            <span className='flex h-14 w-14 items-center justify-center border-2 border-ink bg-signal font-serif text-4xl text-ink transition-transform duration-200 group-hover:-rotate-6'>
              +
            </span>
          </span>
        )}
        <span className='mt-3 block text-sm text-paper/60'>
          <span className='block truncate font-medium text-paper'>{image ? image.name : 'Choose a cover image'}</span>
          PNG, JPG or WebP
        </span>
        <input
          onChange={(e) => onChange(e.target.files[0])}
          type='file'
          id='image'
          className='sr-only'
          accept='image/*'
          disabled={disabled}
        />
      </label>
    </div>
  )
}

export default CoverUpload
