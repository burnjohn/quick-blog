export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  })
}

export const sendError = (res, message = 'Error', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message
  })
}

export const sendData = (res, data, count = null) => {
  const response = {
    success: true,
    ...(count !== null && { count }),
    ...data
  }
  return res.json(response)
}

/**
 * Send a CSV file as a downloadable attachment.
 * @param {import('express').Response} res - Express response object
 * @param {string} content - Full CSV content (header + rows)
 * @param {string} [filename='export.csv'] - Suggested filename for download
 */
export const sendCsv = (res, content, filename = 'export.csv') => {
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  return res.send(content)
}

