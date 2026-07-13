// Small formatting helpers reused across pages. Keeping them here avoids copying
// the same logic into every component.

// Show a number as US dollars, e.g. 49 -> "$49.00". Free courses show "Free".
export function formatPrice(price: number): string {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Turn an ISO date string into something readable, e.g. "Jul 13, 2026".
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// First letters of a name for the round avatar, e.g. "Ada Lovelace" -> "AL".
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
