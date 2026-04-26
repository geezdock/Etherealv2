import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { ArrowRight, AlertCircle } from 'lucide-react';

import Navigation from '../components/Navigation';

export default function JoinSession() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) return;
    
    setIsLoading(true);
    try {
      const { data: sessionData, error } = await supabase
        .from('sessions')
        .select('code, active')
        .eq('code', code.toUpperCase())
        .single();
      
      if (error || !sessionData) {
        setError('Session not found. Please verify your code.');
        return;
      }
      
      if (!sessionData.active) {
        setError('This session is closed to new responses.');
      } else {
        navigate(`/respond/${sessionData.code}`);
      }
    } catch (err) {
      setError('Session not found. Please verify your code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background p-4">
      <div className="absolute left-6 top-6 z-20">
        <Navigation className="mb-0" />
      </div>
      {/* Background radial gradient */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-md"
      >
        <div className="glass-card p-10 flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Enter the Void</h2>
            <p className="text-textMuted text-sm">Input the 6-character access code.</p>
          </div>

          <form onSubmit={handleJoin} className="w-full flex flex-col gap-6">
            <div>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="w-full bg-surface border border-white/5 rounded-xl px-6 py-5 text-center text-3xl tracking-[0.5em] font-medium text-textMain placeholder:text-textMuted/30 focus:outline-none focus:border-primary/50 transition-colors uppercase"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-sm flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={code.length !== 6 || isLoading}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-primaryContainer text-background font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Connecting...' : (
                <>Connect <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
