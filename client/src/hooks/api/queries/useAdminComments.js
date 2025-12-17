import { useState, useEffect } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useAdminComments(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') {
  const { axios } = useAppContext()
  
  const { data, loading, error, refetch } = useApiQuery(
    () => axios.get('/api/admin/comments', {
      params: { page, limit, sortBy, sortOrder }
    }),
    {
      errorMessage: MESSAGES.ERROR_FETCH_COMMENTS,
      dependencies: [page, limit, sortBy, sortOrder]
    }
  )

  return {
    comments: data?.comments || [],
    pagination: data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      hasNextPage: false,
      hasPrevPage: false
    },
    loading,
    error,
    refetch
  }
}

