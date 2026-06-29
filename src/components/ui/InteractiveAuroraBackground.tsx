import { useEffect, useRef, type ReactNode } from 'react'

type InteractiveAuroraBackgroundProps = {
  children: ReactNode
  className?: string
}

export default function InteractiveAuroraBackground({ children, className = '' }: InteractiveAuroraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight)

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || width < 768
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Viewport-relative mouse positions to stay accurate during page scrolls/layout shifts
    let clientX = width * 0.5
    let clientY = height * 0.3
    let mouseActive = false

    const mouse = { x: width * 0.5, y: height * 0.3 }
    const targetMouse = { x: width * 0.5, y: height * 0.3 }

    const handleMouseMove = (e: MouseEvent) => {
      clientX = e.clientX
      clientY = e.clientY
      mouseActive = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
        mouseActive = true
      }
    }

    const handleMouseLeave = () => {
      mouseActive = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // Animation Loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const displayWidth = rect.width
      const displayHeight = rect.height

      // Dynamic Resizing: update drawing buffer sizes on-the-fly to prevent pixel stretching
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        width = canvas.width = displayWidth
        height = canvas.height = displayHeight
      }

      // Calculate target coordinates relative to the canvas bounding rect
      targetMouse.x = clientX - rect.left
      targetMouse.y = clientY - rect.top

      if (!reducedMotion) {
        mouse.x += (targetMouse.x - mouse.x) * 0.08
        mouse.y += (targetMouse.y - mouse.y) * 0.08
      } else {
        mouse.x = targetMouse.x
        mouse.y = targetMouse.y
      }

      ctx.clearRect(0, 0, width, height)

      // 1. Draw Background Grid of Fine Dots with Interactive Gravitational Displacement
      const gridSize = isMobile ? 48 : 36
      ctx.fillStyle = 'rgba(0, 113, 227, 0.04)'
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          let drawX = x
          let drawY = y

          if (!reducedMotion) {
            const dx = x - mouse.x
            const dy = y - mouse.y
            const dist = Math.hypot(dx, dy)
            const warpRadius = isMobile ? 180 : 280

            // Apply light radial displacement mapping away from cursor
            if (dist < warpRadius && dist > 1) {
              const force = (1 - dist / warpRadius) * 6.5
              drawX += (dx / dist) * force
              drawY += (dy / dist) * force
            }
          }

          ctx.beginPath()
          ctx.arc(drawX, drawY, 0.85, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 2. Draw Soft Mouse Aurora Glow ("Sombra Azul") following cursor
      if (mouseActive || !reducedMotion) {
        const glowRad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, isMobile ? 250 : 500)
        glowRad.addColorStop(0, 'rgba(0, 122, 255, 0.14)')
        glowRad.addColorStop(0.35, 'rgba(0, 199, 190, 0.09)')
        glowRad.addColorStop(0.68, 'rgba(125, 211, 252, 0.04)')
        glowRad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowRad
        ctx.fillRect(0, 0, width, height)
      }

      // 3. Draw Soft Left & Right Ambient Border Glows
      const leftGlow = ctx.createRadialGradient(0, height * 0.5, 0, 0, height * 0.5, isMobile ? 200 : 380)
      leftGlow.addColorStop(0, 'rgba(0, 122, 255, 0.08)')
      leftGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = leftGlow
      ctx.fillRect(0, 0, width, height)

      const rightGlow = ctx.createRadialGradient(width, height * 0.5, 0, width, height * 0.5, isMobile ? 200 : 380)
      rightGlow.addColorStop(0, 'rgba(0, 199, 190, 0.08)')
      rightGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = rightGlow
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative isolate w-full overflow-hidden bg-white ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-white"
        style={{ opacity: 0.94 }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}
