import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UserPlus, BarChart2, Key, Hash } from 'lucide-react';
import Modal from '../components/Modal';

export default function Landing() {
  const navigate = useNavigate();
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [dashboardCode, setDashboardCode] = useState('');
  const [hostToken, setHostToken] = useState('');
  const [step, setStep] = useState(1); // 1: Code, 2: Token

  const handleDashboardAccess = (e) => {
    e.preventDefault();
    const code = dashboardCode.trim().toUpperCase();
    
    if (step === 1) {
      if (code.length !== 6) return;
      const savedToken = localStorage.getItem(`hostToken_${code}`);
      if (savedToken) {
        navigate(`/dashboard/${code}`);
      } else {
        setStep(2);
      }
    } else {
      if (!hostToken.trim()) return;
      localStorage.setItem(`hostToken_${code}`, hostToken.trim());
      navigate(`/dashboard/${code}`);
    }
  };

  const closeDashboardModal = () => {
    setIsDashboardModalOpen(false);
    setDashboardCode('');
    setHostToken('');
    setStep(1);
  };

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
              onClick={() => setIsDashboardModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-primary font-medium text-lg flex items-center justify-center gap-2 border border-primary transition-all hover:bg-primary/10 hover:scale-105 active:scale-95"
            >
              <BarChart2 className="w-5 h-5 text-primary" />
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>

      <Modal 
        isOpen={isDashboardModalOpen} 
        onClose={closeDashboardModal}
        title={step === 1 ? "Access Dashboard" : "Authentication Required"}
        description={step === 1 ? "Enter your 6-character session code." : "Enter your secret host token to view results."}
      >
        <form onSubmit={handleDashboardAccess} className="space-y-6">
          {step === 1 ? (
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted/50" />
              <input
                autoFocus
                type="text"
                maxLength={6}
                value={dashboardCode}
                onChange={(e) => setDashboardCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-12 pr-4 text-center text-2xl font-mono font-bold tracking-[0.3em] text-primary focus:outline-none focus:border-primary/50 transition-all uppercase"
              />
            </div>
          ) : (
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted/50" />
              <input
                autoFocus
                type="password"
                value={hostToken}
                onChange={(e) => setHostToken(e.target.value)}
                placeholder="Paste your host token..."
                className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-12 pr-4 text-textMain focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={step === 1 ? dashboardCode.length !== 6 : !hostToken.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primaryContainer text-background font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {step === 1 ? "Continue" : "Verify & Enter"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </Modal>
    </div>
  );
}
