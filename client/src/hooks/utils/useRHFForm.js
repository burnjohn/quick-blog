import { useForm } from 'react-hook-form'

export function useRHFForm(options = {}) {
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    ...options
  })

  return methods
}

