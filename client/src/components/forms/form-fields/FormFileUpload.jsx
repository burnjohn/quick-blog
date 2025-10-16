import { Controller } from 'react-hook-form'

function FormFileUpload({ name, control, label, error, previewSrc, required, accept = 'image/*', ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium'>
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
          <label htmlFor={name} className='cursor-pointer'>
            <img
              src={!value ? previewSrc : URL.createObjectURL(value)}
              alt='Upload preview'
              className='mt-2 h-16 rounded hover:opacity-80 transition-opacity'
            />
            <input
              type='file'
              id={name}
              hidden
              accept={accept}
              onChange={(e) => onChange(e.target.files[0])}
              {...props}
            />
          </label>
          {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>
      )}
    />
  )
}

export { FormFileUpload }

