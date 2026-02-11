import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home, BlogDetail } from './pages/public'
import { Layout, Dashboard, AddBlog, ListBlog, Comments } from './pages/admin'

const Analytics = lazy(() => import('./pages/admin/Analytics'))
import { Login } from './components/admin'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from './constants/routes'
import 'quill/dist/quill.snow.css'

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
          <Route path='analytics' element={<Suspense fallback={<div className="p-4">Loading...</div>}><Analytics /></Suspense>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
