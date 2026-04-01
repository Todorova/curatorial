import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'

const CollectionPage = lazy(() =>
  import('@/pages/collection').then((m) => ({ default: m.CollectionPage })),
)
const ArtworkDetailPage = lazy(() =>
  import('@/pages/artwork-detail').then((m) => ({ default: m.ArtworkDetailPage })),
)
const CollectedPage = lazy(() =>
  import('@/pages/collected').then((m) => ({ default: m.CollectedPage })),
)
const AboutPage = lazy(() =>
  import('@/pages/about').then((m) => ({ default: m.AboutPage })),
)

export default function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-page flex-col border-x border-border">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<CollectionPage />} />
              <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
              <Route path="/collected" element={<CollectedPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
