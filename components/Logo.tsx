'use client'

import { useEffect, useRef } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

export function Logo({ size = 'md', className = '', animated = true }: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sizeMap = {
    sm: { width: 32, height: 32, fontSize: 14 },
    md: { width: 48, height: 48, fontSize: 20 },
    lg: { width: 64, height: 64, fontSize: 28 },
  }

  const { width, height, fontSize } = sizeMap[size]

  useEffect(() => {
    if (!animated || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let angle = 0

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'rgb(10, 10, 15)'
      ctx.fillRect(0, 0, width, height)

      // Draw animated border with glow
      ctx.strokeStyle = '#00ff41'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00ff41'
      ctx.shadowBlur = 8 + Math.sin(angle) * 4

      // Animated rounded rectangle
      const radius = 6
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(width - radius, 0)
      ctx.quadraticCurveTo(width, 0, width, radius)
      ctx.lineTo(width, height - radius)
      ctx.quadraticCurveTo(width, height, width - radius, height)
      ctx.lineTo(radius, height)
      ctx.quadraticCurveTo(0, height, 0, height - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.stroke()

      // Draw center "A" letter with rotation
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate(angle * 0.5)
      ctx.fillStyle = '#00ff41'
      ctx.font = `bold ${fontSize}px 'Bebas Neue', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = '#00ff41'
      ctx.shadowBlur = 12
      ctx.fillText('A', 0, 0)
      ctx.restore()

      // Animated scanlines
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < height; i += 4) {
        ctx.beginPath()
        ctx.moveTo(0, i + (angle % 4))
        ctx.lineTo(width, i + (angle % 4))
        ctx.stroke()
      }

      angle += 0.03
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [animated, width, height, fontSize])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className} glow-pulse`}
      style={{
        filter: 'drop-shadow(0 0 12px #00ff41)',
      }}
    />
  )
}
