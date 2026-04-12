import type { HTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
}

export function Modal({ isOpen, onClose, style, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', pointerEvents: 'none' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', pointerEvents: 'auto' }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'rgba(26,26,26,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,158,0,0.2)',
              borderRadius: '16px 16px 0 0',
              padding: '24px',
              pointerEvents: 'auto',
              ...style,
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
