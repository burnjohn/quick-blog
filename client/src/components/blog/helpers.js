const WORDS_PER_MINUTE = 220
const DAY_MS = 24 * 60 * 60 * 1000

// Local copy so this module has no runtime deps (keeps formatter mocks in tests simple)
const stripTags = (html) => (html ? html.replace(/<[^>]*>/g, ' ') : '')

const toTime = (date) => new Date(date ?? 0).getTime() || 0

/** Newest first. The public API returns posts oldest-first. */
export const sortByNewest = (blogs = []) =>
  [...blogs].sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))

export const countWords = (html) => {
  const text = stripTags(html).trim()
  return text ? text.split(/\s+/).length : 0
}

export const getReadingTime = (html) => Math.max(1, Math.round(countWords(html) / WORDS_PER_MINUTE))

export const formatReadingTime = (html) => `${getReadingTime(html)} min read`

export const padIndex = (index) => String(index + 1).padStart(2, '0')

/** "Issue" number = ISO-ish week of the year, so it changes once a week like a weekly paper */
export const getIssueNumber = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  return Math.ceil(((date - startOfYear) / DAY_MS + startOfYear.getDay() + 1) / 7)
}

export const formatDateline = (date = new Date()) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

// Raster covers (and anything under /photos/) are real photographs; SVG covers are illustrations
const PHOTO_EXTENSION = /\.(png|jpe?g|webp|avif)$/i

/** True when the cover is a photograph rather than an SVG illustration */
export const isPhotoCover = (image) => {
  if (typeof image !== 'string' || !image) return false
  const path = image.split(/[?#]/)[0]
  return path.includes('/photos/') || PHOTO_EXTENSION.test(path)
}

/**
 * Stable partition: photo-covered posts first (original order kept inside each
 * group). Use it to fill prominent image slots; illustrations drift to small slots.
 */
export const photosFirst = (blogs = []) => [
  ...blogs.filter((blog) => isPhotoCover(blog.image)),
  ...blogs.filter((blog) => !isPhotoCover(blog.image))
]

/** Drops posts whose cover image already appeared earlier in the list (seed data reuses covers) */
export const uniqueByImage = (blogs = []) => {
  const seen = new Set()
  return blogs.filter((blog) => {
    if (!blog.image || seen.has(blog.image)) return false
    seen.add(blog.image)
    return true
  })
}

/** Moves the first photo-covered post to the front (for a lead image slot); keeps the rest in order */
export const withPhotoLead = (blogs = []) => {
  const index = blogs.findIndex((blog) => isPhotoCover(blog.image))
  if (index <= 0) return blogs
  return [blogs[index], ...blogs.slice(0, index), ...blogs.slice(index + 1)]
}

/** Groups (already sorted) blogs by category, keeping the order of `categories` */
export const groupByCategory = (blogs, categories) =>
  categories
    .map((category) => ({ category, posts: blogs.filter((blog) => blog.category === category) }))
    .filter((desk) => desk.posts.length > 0)

/** Editor's picks = the long reads: longest posts not already on the front */
export const pickLongReads = (blogs, excludeIds = [], count = 3) =>
  blogs
    .filter((blog) => !excludeIds.includes(blog._id))
    .map((blog) => ({ blog, words: countWords(blog.description) }))
    .sort((a, b) => b.words - a.words)
    .slice(0, count)
    .map(({ blog }) => blog)

/** Same-category posts first, topped up with the newest others */
export const getRelatedPosts = (blogs, current, count = 3) => {
  if (!current) return []
  const others = sortByNewest(blogs).filter((blog) => blog._id !== current._id)
  const sameCategory = others.filter((blog) => blog.category === current.category)
  const rest = others.filter((blog) => blog.category !== current.category)
  return [...sameCategory, ...rest].slice(0, count)
}

export const filterBlogs = (blogs, { search = '', category = 'All' } = {}) => {
  const term = search.trim().toLowerCase()
  return blogs.filter((blog) => {
    const matchesSearch = !term
      || blog.title?.toLowerCase().includes(term)
      || blog.category?.toLowerCase().includes(term)
    const matchesCategory = category === 'All' || blog.category === category
    return matchesSearch && matchesCategory
  })
}

export const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)

/**
 * Adds stable ids to every <h2> in the article HTML and returns the outline.
 * Uses DOMParser so we never build HTML by string concatenation.
 */
export const buildArticleOutline = (html) => {
  if (!html || typeof DOMParser === 'undefined') return { html: html ?? '', headings: [] }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const used = new Set()
  const headings = [...doc.body.querySelectorAll('h2')]
    .map((node, index) => {
      const text = node.textContent.trim()
      if (!text) return null
      let id = `section-${slugify(text) || index + 1}`
      while (used.has(id)) id = `${id}-${index + 1}`
      used.add(id)
      node.id = id
      return { id, text }
    })
    .filter(Boolean)

  return { html: doc.body.innerHTML, headings }
}
