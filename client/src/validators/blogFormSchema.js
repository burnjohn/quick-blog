import { z } from 'zod'

export const blogFormSchema = z.object({
  title: z.string().min(1, 'Blog title is required').trim(),
  subTitle: z.string().min(1, 'Sub title is required').trim(),
  description: z.string().min(1, 'Blog description is required')
    .refine(
      (val) => val !== '<p><br></p>' && val.trim() !== '',
      'Please add blog description'
    ),
  category: z.string().min(1, 'Please select a category'),
  image: z.instanceof(File, { message: 'Please select an image' })
    .refine((file) => file?.size > 0, 'Please select an image'),
  isPublished: z.boolean().default(false)
})

