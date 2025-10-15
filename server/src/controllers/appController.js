export const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'API is Working',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
}

