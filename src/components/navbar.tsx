import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollected } from '@/context/collected-context'
import { SearchBar } from './search-bar'

const NAV_LINKS = [
  { to: '/', label: 'Gallery' },
  { to: '/collected', label: 'Collected' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { count } = useCollected()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-border transition-all duration-200',
          scrolled
            ? 'bg-background/85 backdrop-blur-xl'
            : 'bg-background'
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1126px] items-center justify-between px-8 md:h-16 max-md:h-14 max-md:px-4">
          {/* Wordmark */}
          <Link
            to="/"
            className="font-serif text-xl tracking-[0.06em] text-foreground no-underline uppercase"
          >
            Curatorial
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-1.5 py-5 text-sm font-medium tracking-[0.05em] uppercase no-underline transition-colors duration-200',
                  isActive(link.to)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                {link.to === '/collected' && count > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
                    {count}
                  </span>
                )}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-accent" />
                )}
              </Link>
            ))}

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-11 w-11 items-center justify-center text-muted-foreground cursor-pointer"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center text-muted-foreground cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={18} strokeWidth={1} /> : <Menu size={18} strokeWidth={1} />}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="border-t border-border">
            <div className="mx-auto max-w-[1126px] px-8 py-3 max-md:px-4">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-12 bg-background/95 backdrop-blur-md md:hidden animate-in fade-in duration-200">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'relative flex items-center gap-2 text-2xl font-serif tracking-wide no-underline transition-colors',
                isActive(link.to)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
              {link.to === '/collected' && count > 0 && (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
                  {count}
                </span>
              )}
              {isActive(link.to) && (
                <span className="absolute -bottom-2 left-1 right-1 h-0.5 bg-accent" />
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
