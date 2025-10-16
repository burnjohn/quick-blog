import { Controller } from 'react-hook-form'
import { Input } from '../../ui'

function FormInput({ name, control, label, error, required, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          {...props}
          label={label}
          error={error}
          required={required}
        />
      )}
    />
  )
}

export { FormInput }

