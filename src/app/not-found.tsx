import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up max-w-md">
        <h1 className="font-serif text-8xl font-bold text-crimson/30 mb-2">404</h1>
        <p className="font-serif text-2xl text-foreground mb-4">
          This path does not exist in your kingdom.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          &ldquo;The void stretches in all directions. Only the paths you forge hold form.&rdquo;
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-6 bg-crimson hover:bg-crimson/90 text-white text-sm font-medium tracking-wide rounded-md transition-colors"
        >
          Return to Your Kingdom
        </Link>
      </div>
    </div>
  )
}
