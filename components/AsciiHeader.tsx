'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAsciiText } from 'react-ascii-text'

export function AsciiHeader() {
  const [fontSize, setFontSize] = useState(50)
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
    // Rapidly decrease font size from 50 to 1
    const duration = 2000 // 2 seconds for the animation
    const steps = 49 // from 50 to 1
    const stepDuration = duration / steps

    let currentSize = 50
    const interval = setInterval(() => {
      currentSize -= 1
      setFontSize(currentSize)

      // Calculate opacity based on size (fade out as it gets smaller)
      const opacityValue = currentSize / 50
      setOpacity(opacityValue)

      if (currentSize <= 1) {
        clearInterval(interval)
        setOpacity(0) // Fully disappear
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <pre
        ref={asciiTextRef}
        className="text-white font-mono leading-none"
        style={{
          fontSize: `${fontSize}px`,
          opacity: opacity,
          transition: 'font-size 0.04s linear, opacity 0.04s linear',
          textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}
      />
    </motion.div>
  )
}
