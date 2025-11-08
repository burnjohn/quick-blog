export const ROUTES = {
  HOME: '/',
  BLOG_DETAIL: '/blog/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ADD_BLOG: '/admin/addBlog',
  ADMIN_LIST_BLOG: '/admin/listBlog',
  ADMIN_LIST_COMMENTS: '/admin/listComments'
}

export const getBlogDetailPath = (id) => `/blog/${id}`

