import type { HTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
}

export function Modal({ isOpen, onClose, className, children }: ModalProps) {
  // Uses a faux-viewport overlay approach (absolute inset-0) assuming it's placed inside a relative container.
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#00000080] pointer-events-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "relative w-full max-h-[90vh] overflow-y-auto bg-charcoal-light rounded-t-[14px] border-t border-charcoal-border p-6 shadow-2xl pointer-events-auto",
              className
            )}
            
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
