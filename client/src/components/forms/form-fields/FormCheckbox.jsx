import { Controller } from 'react-hook-form'

function FormCheckbox({ name, control, label, disabled, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className='flex items-center gap-2 mb-8'>
          <input
            type='checkbox'
            id={name}
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className='scale-125 cursor-pointer disabled:cursor-not-allowed'
            {...props}
          />
          <label htmlFor={name} className='cursor-pointer select-none'>
            {label}
          </label>
        </div>
      )}
    />
  )
}

export { FormCheckbox }

