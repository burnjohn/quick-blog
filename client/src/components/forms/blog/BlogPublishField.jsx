import { FormCheckbox } from '../form-fields'

function BlogPublishField({ control, disabled }) {
  return (
    <FormCheckbox
      name='isPublished'
      control={control}
      label='Publish Now'
      disabled={disabled}
    />
  )
}

export { BlogPublishField }

