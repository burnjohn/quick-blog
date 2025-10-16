import { FormFileUpload } from '../form-fields'
import { assets } from '../../../assets/assets'

function BlogImageUploadField({ control, error }) {
  return (
    <FormFileUpload
      name='image'
      control={control}
      label='Upload Thumbnail'
      error={error}
      previewSrc={assets.upload_area}
      accept='image/*'
      required
    />
  )
}

export { BlogImageUploadField }

