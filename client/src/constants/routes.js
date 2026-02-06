export const ROUTES = {
  HOME: '/',
  BLOG_DETAIL: '/blog/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_LIST_BLOG: '/admin/listBlog'
}

export const getBlogDetailPath = (id) => `/blog/${id}`

