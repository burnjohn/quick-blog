import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { blogFormSchema } from '../../validators/blogFormSchema'

function useBlogForm(defaultValues = {}) {
  const form = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      subTitle: '',
      description: '',
      category: 'Startup',
      image: null,
      isPublished: false,
      ...defaultValues
    }
  })

  return {
    ...form,
    // Additional form utilities can be added here
    title: form.watch('title'),
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty
  }
}

export { useBlogForm }

