'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAsciiText } from 'react-ascii-text'

export function AsciiHeader() {
  // Calculate initial font size based on screen width
  const getInitialFontSize = () => {
    if (typeof window === 'undefined') return 50
    const screenWidth = window.innerWidth
    // Mobile: smaller starting size, Desktop: larger starting size
    if (screenWidth < 640) return 20 // Mobile
    if (screenWidth < 1024) return 35 // Tablet
    return 50 // Desktop
  }

  const [initialSize] = useState(getInitialFontSize)
  const [fontSize, setFontSize] = useState(initialSize)
  const [opacity, setOpacity] = useState(1)

  const asciiTextRef = useAsciiText({
    text: 'RUBBSH',
    animationCharacters: '01',
    animationDirection: 'horizontal',
    animationSpeed: 30,
    animationLoop: true,
    fadeInOnly: false,
    isAnimated: true,
  })

  useEffect(() => {
    const duration = 3000 // 3 seconds for the animation
    const startTime = performance.now()
    let animationFrame: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1) // 0 to 1

      // Easing function for smoother animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      // Calculate current size (from initialSize down to 1)
      const currentSize = initialSize - (initialSize - 1) * easeOut
      setFontSize(currentSize)

      // Calculate opacity with smoother fade (quadratic ease-out)
      const opacityEase = 1 - Math.pow(progress, 2)
      setOpacity(opacityEase)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setOpacity(0) // Fully disappear
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [initialSize])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <pre
        ref={asciiTextRef as any}
        className="text-white font-mono leading-none max-w-full overflow-hidden"
        style={{
          fontSize: `${fontSize}px`,
          opacity: opacity,
          textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          willChange: 'transform, opacity',
        }}
      />
    </motion.div>
  )
}
