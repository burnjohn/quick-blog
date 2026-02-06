// Get server base URL from environment or construct from request
export const getServerBaseUrl = (req) => {
  // Use environment variable if set, otherwise construct from request
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL
  }
  const protocol = req.protocol
  const host = req.get('host')
  return `${protocol}://${host}`
}

// Convert relative image path to full URL
export const toFullImageUrl = (imagePath, req) => {
  if (!imagePath) return imagePath
  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${getServerBaseUrl(req)}${imagePath}`
}

// Transform blog object with full image URL
export const transformBlogImage = (blog, req) => {
  const blogObj = blog.toObject ? blog.toObject() : blog
  return {
    ...blogObj,
    image: toFullImageUrl(blogObj.image, req)
  }
}

// Transform array of blogs
export const transformBlogsImages = (blogs, req) => {
  return blogs.map(blog => transformBlogImage(blog, req))
}
