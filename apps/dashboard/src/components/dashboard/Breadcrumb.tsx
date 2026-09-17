import { useLocation, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  overview: 'Overview',
  alerts: 'Alerts',
  works: 'Works',
  reports: 'Reports',
  settings: 'Settings',
}

export function Breadcrumb() {
  const { pathname } = useLocation()

  const segments = pathname.split('/').filter(Boolean)

  // Build cumulative paths: ['dashboard'], ['dashboard','overview'], …
  const crumbs = segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? seg,
    path: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1">
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {crumb.isLast ? (
            <span className="text-sm font-medium uppercase tracking-wider text-[#1A1A18]">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-sm font-medium uppercase tracking-wider text-[#8A8680] hover:text-[#1A1A18] transition-colors"
            >
              {crumb.label}
            </Link>
          )}
          {!crumb.isLast && (
            <ChevronRight className="w-3.5 h-3.5 text-[#8A8680]" strokeWidth={2.5} />
          )}
        </span>
      ))}
    </nav>
  )
}
