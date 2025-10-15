// Async error handler wrapper
// Eliminates try-catch blocks in every controller

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Usage example:
// router.get('/blogs', asyncHandler(getAllBlogs))
// 
// Instead of:
// export const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find()
//     res.json({success: true, blogs})
//   } catch (error) {
//     res.json({success: false, message: error.message})
//   }
// }
//
// You can write:
// export const getAllBlogs = asyncHandler(async (req, res) => {
//   const blogs = await Blog.find()
//   res.json({success: true, blogs})
// })

