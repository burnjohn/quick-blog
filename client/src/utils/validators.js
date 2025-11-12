import { z } from 'zod'

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.trim() !== ''
}

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Zod validation schemas
export const commentFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .email('Please enter a valid email address')
    .min(5, 'Name must be at least 5 characters'),
  content: z
    .string()
    .min(1, 'Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must not exceed 500 characters')
})

