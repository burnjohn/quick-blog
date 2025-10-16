import { FormInput } from '../form-fields'

function BlogTitleField({ control, error }) {
  return (
    <FormInput
      name='title'
      control={control}
      label='Blog Title'
      type='text'
      placeholder='Type here'
      error={error}
      containerClassName='mb-6'
    />
  )
}

export { BlogTitleField }

