import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, CheckCircle } from 'lucide-react';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 max-w-sm w-full text-center flex flex-col items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-primary/20 blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.2 }}
        >
          <CheckCircle className="w-24 h-24 text-primary relative z-10" />
        </motion.div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Transmission complete.</h2>
          <p className="text-textMuted text-sm">Your feedback has been anonymously merged into the void.</p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="relative z-10 mt-4 w-full px-4 py-3 rounded-xl bg-surface border border-white/5 hover:bg-surfaceHigh text-textMain text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" /> Home
        </button>
      </motion.div>
    </div>
  );
}
