import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axios, blogApi } from '../api'
import toast from 'react-hot-toast'
import { MESSAGES } from '../constants/messages'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const navigate = useNavigate()

  const [token, setToken] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [input, setInput] = useState('')

  const fetchBlogs = async () => {
    try {
      const response = await blogApi.getAll()
      if (response.data.success) {
        setBlogs(response.data.blogs)
      } else {
        toast.error(response.data.message || MESSAGES.ERROR_FETCH_BLOGS)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || MESSAGES.ERROR_FETCH_BLOGS)
    }
  }

  useEffect(() => {
    fetchBlogs()
    
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
