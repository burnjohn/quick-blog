import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home, BlogDetail } from './pages/public'
import { Layout, Dashboard, AddBlog, ListBlog, Comments } from './pages/admin'
import { Login } from './components/admin'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import { MotionConfig } from 'motion/react'
import { ROUTES } from './constants/routes'
import 'quill/dist/quill.snow.css'

function App() {
  const { token } = useAppContext()

  return (
    <MotionConfig reducedMotion='user'>
      <Toaster
        position='bottom-right'
        toastOptions={{
          className: '!rounded-none !border !border-ink !bg-surface !text-ink !font-sans !shadow-[4px_4px_0_0_var(--color-ink)]'
        }}
      />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.BLOG_DETAIL} element={<BlogDetail />} />
        <Route path={ROUTES.ADMIN} element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}

export default App
