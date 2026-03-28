import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { GalleryPage } from '@/features/gallery/gallery-page'
import { ArtifactPage } from '@/features/artifact/artifact-page'
import { CollectedPage } from '@/features/collected/collected-page'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <GalleryPage />,
      },
      {
        path: '/artifact/:objectId',
        element: <ArtifactPage />,
      },
      {
        path: '/collected',
        element: <CollectedPage />,
      },
    ],
  },
])
