import { BLOG_CATEGORIES } from '../../../../constants/categories'

function CategoryFilter({ category, onCategoryChange }) {
  return (
    <select
      value={category}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="min-h-11 cursor-pointer border border-ink bg-surface px-4 shadow-hard-sm font-mono text-[11px] uppercase tracking-[0.14em] text-ink outline-none transition-colors hover:bg-signal"
      aria-label="Filter by category"
    >
      {BLOG_CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  )
}

export default CategoryFilter
