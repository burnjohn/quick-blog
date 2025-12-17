import express from 'express'
import { addComment, getBlogComments } from '../controllers/commentController.js'
import { validateCommentInput } from '../validators/commentValidator.js'

const commentRouter = express.Router()

// Public routes - no auth required
commentRouter.post('/add', validateCommentInput, addComment)
commentRouter.get('/blog/:blogId', getBlogComments)

export default commentRouter

