import { Outlet } from 'react-router-dom'
import { Header } from './header'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs leading-relaxed text-muted-foreground/50">
            Built with data from{' '}
            <a
              href="https://metmuseum.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              The Metropolitan Museum of Art Collection API
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
