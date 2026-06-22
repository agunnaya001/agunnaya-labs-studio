interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rect' | 'circle'
  count?: number
}

export function Skeleton({
  className = '',
  variant = 'rect',
  count = 1,
}: SkeletonProps) {
  const baseClass = 'bg-[var(--bg-tertiary)] animate-pulse'

  const variants = {
    text: `${baseClass} h-4 rounded`,
    rect: `${baseClass} h-12 rounded`,
    circle: `${baseClass} rounded-full`,
  }

  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div key={i} className={`${variants[variant]} ${className} mb-2`} />
  ))

  return <>{skeletons}</>
}

export function ProjectCardSkeleton() {
  return (
    <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <Skeleton className="h-5 w-1/2 mb-3" variant="text" />
      <Skeleton className="h-4 w-full mb-2" variant="text" />
      <Skeleton className="h-4 w-2/3" variant="text" />
    </div>
  )
}

export function EditorSkeleton() {
  return (
    <div className="h-full rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-2">
      <Skeleton className="h-6 w-1/3" variant="text" />
      <Skeleton className="h-64 w-full" variant="rect" />
    </div>
  )
}
