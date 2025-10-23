'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

interface GlassCardProps extends HTMLMotionProps<'article'> {
  variant?: 'default' | 'colored'
  colorScheme?: 'foodscraps' | 'recyclablecontainers' | 'paper' | 'garbage'
  children: React.ReactNode
  className?: string
}

export default function GlassCard({
  variant = 'default',
  colorScheme,
  children,
  className,
  ...props
}: GlassCardProps) {
  const colorClasses = {
    foodscraps: 'glass-card-foodscraps',
    recyclablecontainers: 'glass-card-recyclablecontainers',
    paper: 'glass-card-paper',
    garbage: 'glass-card-garbage'
  }

  return (
    <motion.article
      className={clsx(
        'glass-card',
        variant === 'colored' && colorScheme && colorClasses[colorScheme],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      {...props}
    >
      {children}
    </motion.article>
  )
}