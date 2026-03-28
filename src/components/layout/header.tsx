import { Link, useLocation } from 'react-router-dom'
import { useCollected } from '@/hooks/useCollected'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIdx = order.indexOf(theme)
    setTheme(order[(currentIdx + 1) % order.length])
  }

  return (
    <button
      onClick={cycleTheme}
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {resolvedTheme === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  )
}

export function Header() {
  const location = useLocation()
  const { count } = useCollected()

  const navItems = [
    { path: '/', label: 'Gallery' },
    { path: '/collected', label: 'Collected' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-foreground no-underline">
          <img src="/favicon-32.png" alt="" className="h-7 w-7 rounded" aria-hidden="true" />
          <span className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
            Curatorial
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative rounded-full px-3.5 py-1.5 text-sm font-medium no-underline transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {item.path === '/collected' && count > 0 && (
                  <span className="ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
          <div className="ml-1.5 h-5 w-px bg-border/60" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
