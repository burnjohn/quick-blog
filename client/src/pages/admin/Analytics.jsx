import React from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/admin/analytics/FilterBar'
import KpiSection from '../../components/admin/analytics/KpiSection'
import ChartSection from '../../components/admin/analytics/ChartSection'
import TableSection from '../../components/admin/analytics/TableSection'

function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterParams = {
    period: searchParams.get('period') || '30d',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    category: searchParams.get('category') || ''
  }

  const updateFilter = (updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v)
        else next.delete(k)
      })
      return next
    })
  }

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50 min-h-full'>
      <h1 className='text-2xl font-semibold text-gray-700 mb-6'>Analytics</h1>
      <FilterBar filterParams={filterParams} onFilterChange={updateFilter} />
      <KpiSection filterParams={filterParams} />
      <ChartSection filterParams={filterParams} onFilterChange={updateFilter} />
      <TableSection filterParams={filterParams} />
    </div>
  )
}

export default Analytics
