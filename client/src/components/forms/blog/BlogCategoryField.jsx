import { FormSelect } from '../form-fields'
import { BLOG_CATEGORIES } from '../../../constants/categories'

function BlogCategoryField({ control, error, disabled }) {
  const categoryOptions = BLOG_CATEGORIES.filter(cat => cat !== 'All')
  
  return (
    <FormSelect
      name='category'
      control={control}
      label='Blog Category'
      options={categoryOptions}
      error={error}
      disabled={disabled}
      required
    />
  )
}

export { BlogCategoryField }

