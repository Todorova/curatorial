export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex h-20 max-w-[1126px] items-center justify-between px-8 max-md:px-4 max-md:flex-col max-md:justify-center max-md:gap-1 max-md:h-auto max-md:py-6">
        <span className="font-serif text-sm text-foreground">
          Curatorial
        </span>
        <span className="text-xs text-muted-foreground">
          Built with the Metropolitan Museum of Art Open Access API
        </span>
      </div>
    </footer>
  )
}
