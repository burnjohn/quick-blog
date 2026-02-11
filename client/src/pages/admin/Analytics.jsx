import { useState } from 'react'
import KpiSection from '../../components/admin/analytics/KpiSection'
import ChartSection from '../../components/admin/analytics/ChartSection'
import FilterBar from '../../components/admin/analytics/filters/FilterBar'
import TableSection from '../../components/admin/analytics/tables/TableSection'
import DrillDownModal from '../../components/admin/analytics/DrillDownModal'
import { analyticsApi } from '../../api/analyticsApi'

function Analytics() {
  const [period, setPeriod] = useState('30')
  const [category, setCategory] = useState('All')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [drillDown, setDrillDown] = useState({ open: false, date: null, posts: [], loading: false })

  const filterParams = {
    period,
    category,
    ...(dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : {})
  }

  const handleDrillDown = async (date) => {
    setDrillDown({ open: true, date, posts: [], loading: true })
    try {
      const res = await analyticsApi.getDrillDown(date, filterParams)
      setDrillDown((prev) => ({ ...prev, posts: res.data?.data ?? [], loading: false }))
    } catch {
      setDrillDown((prev) => ({ ...prev, posts: [], loading: false }))
    }
  }

  const closeDrillDown = () => {
    setDrillDown({ open: false, date: null, posts: [], loading: false })
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 min-h-full">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <FilterBar
        period={period}
        onPeriodChange={setPeriod}
        category={category}
        onCategoryChange={setCategory}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        filterParams={filterParams}
      />
      <KpiSection params={filterParams} />
      <ChartSection
        params={filterParams}
        onCategoryChange={setCategory}
        onDrillDown={handleDrillDown}
      />
      <TableSection params={filterParams} />
      <DrillDownModal
        isOpen={drillDown.open}
        onClose={closeDrillDown}
        date={drillDown.date}
        posts={drillDown.posts}
        loading={drillDown.loading}
      />
    </div>
  )
}

export default Analytics
