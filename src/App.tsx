import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CollectionPage } from '@/pages/collection'
import { ArtworkDetailPage } from '@/pages/artwork-detail'
import { CollectedPage } from '@/pages/collected'
import { AboutPage } from '@/pages/about'

export default function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-content flex-col border-x border-border">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CollectionPage />} />
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
          <Route path="/collected" element={<CollectedPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
