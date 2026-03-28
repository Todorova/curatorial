interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="px-8 pt-12 pb-6 max-md:px-4 max-md:pt-8 max-md:pb-4">
      <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground max-md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          {description}
        </p>
      )}
    </div>
  )
}
