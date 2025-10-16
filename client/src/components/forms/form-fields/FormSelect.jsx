import { Controller } from 'react-hook-form'

function FormSelect({ name, control, label, options, error, required, disabled, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium'>
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
          <select 
            {...field}
            {...props}
            disabled={disabled}
            className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full max-w-lg focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>
      )}
    />
  )
}

export { FormSelect }

