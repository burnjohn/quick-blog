import PeriodFilter from './PeriodFilter'
import CategoryFilter from './CategoryFilter'
import ExportButton from '../ExportButton'

function FilterBar({
  period,
  onPeriodChange,
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  filterParams
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <PeriodFilter
        period={period}
        onPeriodChange={onPeriodChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />
      <CategoryFilter category={category} onCategoryChange={onCategoryChange} />
      <ExportButton filterParams={filterParams} />
    </div>
  )
}

export default FilterBar
