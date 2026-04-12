import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function PageWrapper({ children, noPadding = false }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: noPadding ? 0 : '28px 32px',
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {children}
    </motion.main>
  )
}
