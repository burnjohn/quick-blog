import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home, BlogDetail } from './pages/public'
import { Layout, Dashboard, AddBlog, ListBlog, Comments } from './pages/admin'
import { Login } from './components/admin'
import AnalyticsSkeleton from './components/admin/analytics/AnalyticsSkeleton'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from './constants/routes'
import 'quill/dist/quill.snow.css'

// Lazy: keeps Recharts out of the public bundle
const Analytics = lazy(() => import('./pages/admin/Analytics/Analytics.jsx'))

function App() {
  const { token } = useAppContext()

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.BLOG_DETAIL} element={<BlogDetail />} />
        <Route path={ROUTES.ADMIN} element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
          <Route
            path='analytics'
            element={
              <Suspense fallback={<AnalyticsSkeleton />}>
                <Analytics />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
