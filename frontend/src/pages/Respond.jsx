import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Send, Shield, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const RATING_COLORS = [
  'hover:border-red-400 hover:bg-red-400/20 data-[active=true]:border-red-400 data-[active=true]:bg-red-400/20 data-[active=true]:text-red-400',
  'hover:border-orange-400 hover:bg-orange-400/20 data-[active=true]:border-orange-400 data-[active=true]:bg-orange-400/20 data-[active=true]:text-orange-400',
  'hover:border-yellow-400 hover:bg-yellow-400/20 data-[active=true]:border-yellow-400 data-[active=true]:bg-yellow-400/20 data-[active=true]:text-yellow-400',
  'hover:border-lime-400 hover:bg-lime-400/20 data-[active=true]:border-lime-400 data-[active=true]:bg-lime-400/20 data-[active=true]:text-lime-400',
  'hover:border-green-400 hover:bg-green-400/20 data-[active=true]:border-green-400 data-[active=true]:bg-green-400/20 data-[active=true]:text-green-400',
];

const LoadingSkeleton = () => (
  <div className="w-full max-w-3xl space-y-10 animate-pulse">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-4 w-32 bg-surfaceHigh rounded-full" />
      <div className="h-12 w-64 bg-surfaceHigh rounded-xl" />
      <div className="h-4 w-48 bg-surfaceHigh rounded-full" />
    </div>
    <div className="space-y-8">
      {[1, 2].map(i => (
        <div key={i} className="h-48 bg-surfaceHigh/50 rounded-2xl border border-white/5" />
      ))}
    </div>
  </div>
);

export default function Respond() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/api/sessions/${code}`);
        if (!res.data.active) {
          navigate('/');
        } else {
          setSession(res.data);
        }
      } catch (err) {
        navigate('/');
      } finally {
        setTimeout(() => setIsLoading(false), 800); // Slight delay for smooth transition
      }
    };
    fetchSession();
  }, [code, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== session.questions.length || session.questions.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await api.post(`/api/sessions/${code}/responses`, { answers });
      navigate('/thank-you');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Navigation = () => (
    <div className="flex gap-2 mb-6">
      <button onClick={() => navigate(-1)} className="px-3 py-1 rounded-lg bg-surfaceHigh text-textMuted text-xs font-medium border border-white/10 hover:bg-surface active:scale-95 transition-all">← Back</button>
      <button onClick={() => navigate('/')} className="px-3 py-1 rounded-lg bg-surfaceHigh text-textMuted text-xs font-medium border border-white/10 hover:bg-surface active:scale-95 transition-all">🏠 Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <Navigation />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center mt-8"
          >
            <LoadingSkeleton />
          </motion.div>
        ) : session && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl mt-8 mb-24 space-y-10"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary/70 mb-4">
                <Shield className="w-4 h-4" /> Anonymous Connection
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{session.topic}</h1>
              <p className="text-textMuted text-sm sm:text-base">Hosted by {session.hostName}</p>
            </div>

            {/* Questions */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {session.questions.map((q, idx) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 sm:p-8 space-y-6"
                >
                  <h3 className="text-xl font-medium tracking-wide">{q.text}</h3>
                  {q.type === 'TEXT' ? (
                    <textarea 
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                      placeholder="Share your thoughts honestly..."
                      className="w-full bg-surface border border-white/5 rounded-xl p-4 text-textMain min-h-[120px] resize-y placeholder:text-textMuted/40 focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  ) : (
                    <div className="flex justify-between items-center max-w-lg mx-auto gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          data-active={answers[q.id] === String(val)}
                          onClick={() => setAnswers({...answers, [q.id]: String(val)})}
                          className={clsx(
                            "w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 bg-surfaceHigh text-textMuted font-bold text-lg transition-all duration-300",
                            RATING_COLORS[val - 1]
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {session.questions.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4">
                   <AlertCircle className="w-12 h-12 text-textMuted/30 mx-auto" />
                   <p className="text-textMuted text-lg">This session has no open questions at the moment.</p>
                   <button 
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-primary hover:underline font-medium"
                   >
                     Return to safety
                   </button>
                </div>
              ) : (
                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={isSubmitting || Object.keys(answers).length !== session.questions.length}
                    className="w-full max-w-md mx-auto px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-primaryContainer text-background font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Transmitting...' : (
                      <>Submit Feedback <Send className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
