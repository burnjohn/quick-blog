import { originalBlogs } from './original.js'
import { additionalBlogs } from './additional.js'

export const blogs = [...originalBlogs, ...additionalBlogs]
