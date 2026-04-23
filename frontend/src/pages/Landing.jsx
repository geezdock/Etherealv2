import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UserPlus, BarChart2 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primaryContainer/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accentViolet/20 blur-[120px] rounded-full mix-blend-screen" />
      
      <div className="z-10 text-center max-w-4xl px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Welcome to <span className="gradient-text">Ethereal.</span>
          </h1>
          <p className="text-xl md:text-2xl text-textMuted mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            A premium sanctuary for anonymous thoughts. No friction, no heavy structures. Just an atmospheric space for honest communication.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
            <button 
              onClick={() => navigate('/create')}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primaryContainer text-background font-semibold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center justify-center gap-2">
                Create Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button 
              onClick={() => navigate('/join')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-textMain font-medium text-lg flex items-center justify-center gap-2 transition-all hover:bg-surfaceHigh hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-5 h-5 text-textMuted" />
              Join Session
            </button>

            <button
              onClick={() => {
                const code = window.prompt('Enter your session code to access the dashboard:');
                if (code && code.length === 6) {
                  const hostToken = localStorage.getItem(`hostToken_${code.toUpperCase()}`);
                  if (!hostToken) {
                    const inputToken = window.prompt('Enter your host token for this session:');
                    if (inputToken && inputToken.length > 0) {
                      localStorage.setItem(`hostToken_${code.toUpperCase()}`, inputToken);
                      navigate(`/dashboard/${code.toUpperCase()}`);
                    } else {
                      alert('Host token is required for dashboard access.');
                    }
                  } else {
                    navigate(`/dashboard/${code.toUpperCase()}`);
                  }
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-primary font-medium text-lg flex items-center justify-center gap-2 border border-primary transition-all hover:bg-primary/10 hover:scale-105 active:scale-95"
            >
              <BarChart2 className="w-5 h-5 text-primary" />
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
