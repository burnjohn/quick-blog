import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/admin/analytics/filters/FilterBar'
import KpiSection from '../../components/admin/analytics/KpiSection'
import ChartSection from '../../components/admin/analytics/ChartSection'
import TableSection from '../../components/admin/analytics/tables/TableSection'
import DrillDownModal from '../../components/admin/analytics/DrillDownModal'
import { analyticsApi } from '../../api/analyticsApi'

function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams()

  const period = searchParams.get('period') || '30'
  const category = searchParams.get('category') || 'All'
  const fromDate = searchParams.get('from') || ''
  const toDate = searchParams.get('to') || ''

  const [drillDown, setDrillDown] = useState({ isOpen: false, date: null, posts: [], loading: false })

  const dateRange = useMemo(() => ({ from: fromDate, to: toDate }), [fromDate, toDate])

  const filterParams = useMemo(() => {
    const params = { period, category }
    if (fromDate && toDate) {
      params.from = fromDate
      params.to = toDate
    }
    return params
  }, [period, category, fromDate, toDate])

  const handlePeriodChange = useCallback((value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('period', value)
      next.delete('from')
      next.delete('to')
      return next
    })
  }, [setSearchParams])

  const handleCategoryChange = useCallback((value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('category', value)
      return next
    })
  }, [setSearchParams])

  const handleDateRangeChange = useCallback((range) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (range.from) next.set('from', range.from)
      else next.delete('from')
      if (range.to) next.set('to', range.to)
      else next.delete('to')
      return next
    })
  }, [setSearchParams])

  const handleDrillDown = useCallback(async (date) => {
    setDrillDown({ isOpen: true, date, posts: [], loading: true })
    try {
      const res = await analyticsApi.getDrillDown(date, filterParams)
      setDrillDown((prev) => ({ ...prev, posts: res.data?.data ?? [], loading: false }))
    } catch {
      setDrillDown((prev) => ({ ...prev, posts: [], loading: false }))
    }
  }, [filterParams])

  const handleCloseDrillDown = useCallback(() => {
    setDrillDown({ isOpen: false, date: null, posts: [], loading: false })
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>

      <FilterBar
        period={period}
        onPeriodChange={handlePeriodChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        filterParams={filterParams}
      />

      <KpiSection params={filterParams} />
      <ChartSection
        params={filterParams}
        onCategoryChange={handleCategoryChange}
        onDrillDown={handleDrillDown}
      />
      <TableSection params={filterParams} />

      <DrillDownModal
        isOpen={drillDown.isOpen}
        onClose={handleCloseDrillDown}
        date={drillDown.date}
        posts={drillDown.posts}
        loading={drillDown.loading}
      />
    </div>
  )
}

export default Analytics
