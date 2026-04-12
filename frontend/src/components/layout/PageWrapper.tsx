import type { ReactNode } from 'react';
import { motion } from "framer-motion"

interface PageWrapperProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function PageWrapper({ children, className = "", noPadding = false }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`flex-1 flex flex-col h-full overflow-hidden ${noPadding ? '' : 'p-6 bg-charcoal'} ${className}`}
    >
      <div className={`${noPadding ? 'w-full h-full' : 'w-full h-full overflow-y-auto pr-2'}`}>
        {children}
      </div>
    </motion.main>
  )
}
