import { useEffect, useRef, ReactNode } from 'react'

type InteractiveAuroraBackgroundProps = {
  children: ReactNode
  className?: string
}

export default function InteractiveAuroraBackground({ children, className = '' }: InteractiveAuroraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Set initial values
    container.style.setProperty('--mouse-x', '50%')
    container.style.setProperty('--mouse-y', '50%')

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      return
    }

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0
    let isMouseIn = false

    // Initialize positioning to center of bounding box
    const rect = container.getBoundingClientRect()
    currentX = rect.width / 2
    currentY = rect.height / 2
    mouseX = currentX
    mouseY = currentY

    const handleMouseMove = (e: MouseEvent) => {
      const activeRect = container.getBoundingClientRect()
      mouseX = e.clientX - activeRect.left
      mouseY = e.clientY - activeRect.top
      isMouseIn = true
    }

    const handleMouseLeave = () => {
      isMouseIn = false
    }

    let animationFrameId: number

    const updateSpotlight = () => {
      if (isMouseIn) {
        // Interpolate toward current mouse positions
        currentX += (mouseX - currentX) * 0.08
        currentY += (mouseY - currentY) * 0.08
      } else {
        // Slow float back to container center if mouse is out of frame
        const activeRect = container.getBoundingClientRect()
        const targetX = activeRect.width / 2
        const targetY = activeRect.height / 2
        currentX += (targetX - currentX) * 0.02
        currentY += (targetY - currentY) * 0.02
      }

      container.style.setProperty('--mouse-x', `${currentX}px`)
      container.style.setProperty('--mouse-y', `${currentY}px`)

      animationFrameId = requestAnimationFrame(updateSpotlight)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    animationFrameId = requestAnimationFrame(updateSpotlight)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: `
          radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0, 113, 227, 0.30), transparent 55%),
          radial-gradient(800px circle at 75% 25%, rgba(0, 199, 190, 0.16), transparent 60%),
          linear-gradient(135deg, #f8fbff 0%, #eef5fb 45%, #ffffff 100%)
        `,
        willChange: 'background'
      }}
    >
      {/* Background subtle static decorations for extra depth */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[75%] w-[65%] rounded-full bg-cyan-200/10 blur-[130px]" />
        <div className="absolute bottom-[-15%] left-[-5%] h-[60%] w-[50%] rounded-full bg-purple-200/10 blur-[120px]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
