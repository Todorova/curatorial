import { PageHeader } from '@/components/page-header'

export function AboutPage() {
  return (
    <>
      <PageHeader title="About" />
      <div className="px-8 pb-16 max-md:px-4">
        <div className="max-w-lg">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Curatorial is a collection explorer built on The Metropolitan
            Museum of Art&apos;s Open Access API. It provides a curated view
            of highlighted works across the museum&apos;s departments.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            All artwork data and images are provided by The Met&apos;s
            Open Access program under a Creative Commons Zero (CC0) license.
          </p>
        </div>
      </div>
    </>
  )
}
