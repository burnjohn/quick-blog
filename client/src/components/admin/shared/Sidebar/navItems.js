import { assets } from '../../../../assets/assets'
import { ROUTES } from '../../../../constants/routes'

export const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: assets.home_icon, end: true },
  { to: ROUTES.ADMIN_ADD_BLOG, label: 'Add blogs', icon: assets.add_icon },
  { to: ROUTES.ADMIN_LIST_BLOG, label: 'Blog lists', icon: assets.list_icon },
  { to: ROUTES.ADMIN_COMMENTS, label: 'Comments', icon: assets.comment_icon },
  { to: ROUTES.ADMIN_ANALYTICS, label: 'Analytics', icon: assets.chart_icon },
]

export const getNavLabel = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/'
  return NAV_ITEMS.find((item) => item.to === path)?.label
}
