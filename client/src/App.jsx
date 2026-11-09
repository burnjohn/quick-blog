import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Home, BlogDetail } from './pages/public'
import { Layout, Dashboard, AddBlog, ListBlog, Comments } from './pages/admin'
import { Login } from './components/admin'
import { AuroraBackground } from './components/effects'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from './constants/routes'
import 'quill/dist/quill.snow.css'

const TOAST_OPTIONS = {
  className: '!bg-surface/90 !text-ink !border !border-white/10 !rounded-xl !backdrop-blur-xl !font-sans !text-sm',
  success: { iconTheme: { primary: '#d4ff3a', secondary: '#05060a' } },
  error: { iconTheme: { primary: '#fb7185', secondary: '#05060a' } },
}

function App() {
  const { token } = useAppContext()

  return (
    <MotionConfig reducedMotion='user'>
      <div className='relative isolate min-h-screen bg-void text-ink'>
        <AuroraBackground />
        <Toaster position='bottom-right' toastOptions={TOAST_OPTIONS} />
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
      </div>
    </MotionConfig>
  )
}

export default App
