// بتحول timestamp لنص زي "3 days ago" لعرض "Last updated"
export function timeAgo(dateStr: string): string {
  const diffSec = Math.round((new Date(dateStr).getTime() - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  for (const [unit, secs] of units) {
    if (Math.abs(diffSec) >= secs) {
      return rtf.format(Math.round(diffSec / secs), unit)
    }
  }
  return 'just now'
}