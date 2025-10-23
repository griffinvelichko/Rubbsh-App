'use client'

import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glowOnHover?: boolean
  children: React.ReactNode
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    glowOnHover = true,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
      xl: 'px-8 py-4 text-xl min-h-[56px]'
    }

    const variantClasses = {
      primary: 'glass-button-primary',
      secondary: 'glass-button-secondary',
      ghost: 'glass-button-ghost'
    }

    return (
      <motion.button
        ref={ref}
        className={clsx(
          'glass-button',
          sizeClasses[size],
          variantClasses[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        disabled={disabled}
        {...props}
      >
        {glowOnHover && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-primary/20 to-primary-dark/20 blur-xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
  }
)

GlassButton.displayName = 'GlassButton'

export default GlassButton