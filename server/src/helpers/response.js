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

