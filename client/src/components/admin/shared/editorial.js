// Small text helpers shared by the admin front-page blocks.

export const pad2 = (n) => String(n ?? 0).padStart(2, '0')

export const plural = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`

export const longDateLabel = (date = new Date()) => date.toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})
