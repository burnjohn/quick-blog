export const TEXT_COLUMNS = ['title']

// Direction a column starts with when first selected
export const defaultDirFor = (column) => (TEXT_COLUMNS.includes(column) ? 'asc' : 'desc')

// Next sort state after clicking a header
export const nextSort = (column, currentSort, currentDir) => {
  if (column === currentSort) return { sort: column, dir: currentDir === 'asc' ? 'desc' : 'asc' }
  return { sort: column, dir: defaultDirFor(column) }
}

// Pure, stable sort. Missing numeric values always go last.
export const sortPosts = (posts = [], sort = 'views', dir = 'desc') => {
  const factor = dir === 'asc' ? 1 : -1
  return posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => {
      const av = a.post[sort]
      const bv = b.post[sort]
      let result
      if (sort === 'title') {
        result = String(av ?? '').localeCompare(String(bv ?? ''), 'en', { sensitivity: 'base' }) * factor
      } else {
        const aMissing = typeof av !== 'number'
        const bMissing = typeof bv !== 'number'
        if (aMissing || bMissing) result = aMissing === bMissing ? 0 : aMissing ? 1 : -1
        else result = (av - bv) * factor
      }
      return result || a.index - b.index
    })
    .map(({ post }) => post)
}
