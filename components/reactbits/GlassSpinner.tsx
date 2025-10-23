'use client'

import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface GlassSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  label?: string
}

export default function GlassSpinner({
  size = 'md',
  className,
  label
}: GlassSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  }

  return (
    <div className={clsx('glass-spinner-container', className)}>
      <motion.div
        className={clsx(
          'glass-spinner',
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {label && (
        <p className="glass-spinner-label">{label}</p>
      )}
    </div>
  )
}