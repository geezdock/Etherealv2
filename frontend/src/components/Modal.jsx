import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, description, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md pointer-events-auto glass-card p-6 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  {title && <h2 className="text-2xl font-bold tracking-tight mb-1">{title}</h2>}
                  {description && <p className="text-textMuted text-sm">{description}</p>}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="relative group p-2 rounded-full bg-surfaceHigh/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-surfaceHigh/60 hover:border-primary/30"
                >
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-primary/20 -z-10" />
                  <X className="w-5 h-5 text-textMuted group-hover:text-primary transition-colors" />
                </motion.button>
              </div>

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
