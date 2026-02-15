import { useState, useMemo, useCallback } from 'react'
import { getDateRange } from '../../utils/dateUtils'
import { PERIOD_PRESETS } from '../../constants/analytics'

export function useAnalyticsFilters() {
  const [period, setPeriod] = useState('30d')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [category, setCategory] = useState('All')

  const isCustomPeriod = period === 'custom'

  // Note: getDateRange uses new Date() so the range stays fixed until period/custom dates change.
  // For analytics this is acceptable — the range won't silently shift across midnight.
  const dateRange = useMemo(() => {
    if (isCustomPeriod) {
      return { startDate: customStartDate, endDate: customEndDate }
    }
    return getDateRange(PERIOD_PRESETS[period]?.days)
  }, [period, isCustomPeriod, customStartDate, customEndDate])

  const filterParams = useMemo(() => {
    const params = {}
    if (dateRange.startDate) params.startDate = dateRange.startDate
    if (dateRange.endDate) params.endDate = dateRange.endDate
    if (category && category !== 'All') params.category = category
    return params
  }, [dateRange, category])

  const handlePeriodChange = useCallback((newPeriod) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setCustomStartDate('')
      setCustomEndDate('')
    }
  }, [])

  const handleCustomDateChange = useCallback((start, end) => {
    setPeriod('custom')
    setCustomStartDate(start)
    setCustomEndDate(end)
  }, [])

  const resetFilters = useCallback(() => {
    setPeriod('30d')
    setCustomStartDate('')
    setCustomEndDate('')
    setCategory('All')
  }, [])

  return {
    period,
    setPeriod: handlePeriodChange,
    customStartDate,
    customEndDate,
    setCustomDateRange: handleCustomDateChange,
    category,
    setCategory,
    filterParams,
    isCustomPeriod,
    resetFilters
  }
}
