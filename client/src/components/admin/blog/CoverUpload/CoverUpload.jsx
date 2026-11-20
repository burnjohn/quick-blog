import React from 'react'

function CoverUpload({ image, onChange, disabled = false }) {
  return (
    <div>
      <p className='mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink'>
        Upload Thumbnail <span className='text-danger' aria-hidden='true'>*</span>
      </p>
      <label
        htmlFor='image'
        className='group flex cursor-pointer items-center gap-5 border border-dashed border-ink bg-paper p-4 transition-colors hover:bg-signal/30 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ink'
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt='Upload preview'
            className='h-24 w-36 border border-ink object-cover'
          />
        ) : (
          <span
            aria-hidden='true'
            className='flex h-24 w-36 items-center justify-center border border-ink bg-surface font-serif text-4xl text-ink transition-colors group-hover:bg-signal'
          >
            +
          </span>
        )}
        <span className='text-sm text-ink-muted'>
          <span className='block font-medium text-ink'>{image ? image.name : 'Choose a cover image'}</span>
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
