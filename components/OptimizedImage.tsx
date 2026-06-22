'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  lazy?: boolean
  fallback?: string
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  lazy = true,
  fallback,
  onLoad,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Preload image
    if (src && typeof src === 'string') {
      const img = document.createElement('img') as HTMLImageElement
      img.onload = () => {
        setIsLoading(false)
        onLoad?.()
      }
      img.onerror = () => {
        setIsLoading(false)
        setHasError(true)
      }
      img.src = src
    }
  }, [src, onLoad])

  if (hasError && fallback) {
    return (
      <div className={`bg-[var(--bg-tertiary)] flex items-center justify-center ${className}`}>
        <span className="text-[var(--text-dim)] text-sm">Failed to load image</span>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-[var(--bg-tertiary)] animate-pulse rounded ${className}`}
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </>
  )
}
