import { FormInput } from '../form-fields'

function BlogSubTitleField({ control, error }) {
  return (
    <FormInput
      name='subTitle'
      control={control}
      label='Sub Title'
      type='text'
      placeholder='Type here'
      error={error}
      containerClassName='mb-6'
    />
  )
}

export { BlogSubTitleField }

