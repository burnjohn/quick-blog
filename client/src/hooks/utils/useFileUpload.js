import { useState, useEffect } from 'react'

export function useFileUpload(options = {}) {
  const { accept = 'image/*', maxSize = 5 * 1024 * 1024 } = options
  const [preview, setPreview] = useState(null)

  const handleFileChange = (file, onChange) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onChange(file)
    }
  }

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  const validationRules = {
    required: 'Image is required',
    validate: (file) => {
      if (!file) return 'Please select an image'
      
      const acceptType = accept.split('/')[0]
      if (!file.type.startsWith(acceptType)) {
        return `Please select a valid ${accept} file`
      }
      
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / 1024 / 1024
        return `File size must be less than ${maxSizeMB}MB`
      }
      
      return true
    }
  }

  useEffect(() => {
    return clearPreview
  }, [])

  return {
    preview,
    handleFileChange,
    clearPreview,
    validationRules
  }
}

