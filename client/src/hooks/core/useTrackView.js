import { useEffect, useRef } from 'react'
import axios from '../../api/axiosConfig'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'
import { useAppContext } from '../../context/AppContext'

// Generate or retrieve a session ID for view deduplication
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('viewSessionId')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('viewSessionId', sessionId)
  }
  return sessionId
}

// Classify document.referrer into categories
const classifyReferrer = () => {
  const ref = document.referrer
  if (!ref) return 'direct'

  try {
    const url = new URL(ref)
    const hostname = url.hostname.toLowerCase()

    // Search engines
    if (/google|bing|yahoo|duckduckgo|baidu|yandex/.test(hostname)) return 'search'

    // Social media
    if (/facebook|twitter|x\.com|linkedin|instagram|reddit|tiktok|youtube|pinterest/.test(hostname)) return 'social'

    // Same origin = direct navigation
    if (hostname === window.location.hostname) return 'direct'

    return 'other'
  } catch {
    return 'other'
  }
}

export function useTrackView(blogId) {
  const { token } = useAppContext()
  const trackedIds = useRef(new Set())

  useEffect(() => {
    if (!blogId || trackedIds.current.has(blogId)) return
    trackedIds.current.add(blogId)

    const trackView = async () => {
      try {
        await axios.post(API_ENDPOINTS.VIEWS_TRACK, {
          blogId,
          sessionId: getSessionId(),
          referrer: classifyReferrer(),
          isAdmin: !!token
        })
      } catch {
        // Silently fail — view tracking should never block UX
      }
    }

    trackView()
  }, [blogId, token])
}
