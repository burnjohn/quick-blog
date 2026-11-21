import { BLOG_CATEGORIES } from '../../../../constants/categories'

function CategoryFilter({ category, onCategoryChange }) {
  return (
    <select
      value={category}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
