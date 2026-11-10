// Triggers a browser download for a Blob
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// Extracts filename from a Content-Disposition header value
export const filenameFromDisposition = (header, fallback = 'download.csv') => {
  const match = /filename="?([^";]+)"?/i.exec(header || '')
  return match ? match[1] : fallback
}
