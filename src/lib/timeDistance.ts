export function timeDistanceFromNow(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days < 1) return "Today"
  if (days === 1) return "1 day ago"
  if (days < 30) return `${days} days ago`

  const months = Math.floor(days / 30)
  if (months === 1) return "About 1 month ago"
  if (months < 12) return `About ${months} months ago`

  const years = Math.floor(months / 12)
  if (years === 1) return "About 1 year ago"
  return `About ${years} years ago`
}
