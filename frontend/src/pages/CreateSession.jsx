import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, X, AlignLeft, Star, ArrowRight } from 'lucide-react';

export default function CreateSession() {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation buttons
  const Navigation = () => (
    <div className="flex gap-2 mb-6">
      <button onClick={() => navigate(-1)} className="px-3 py-1 rounded-lg bg-surfaceHigh text-textMuted text-xs font-medium border border-white/10 hover:bg-surface active:scale-95 transition-all">← Back</button>
      <button onClick={() => navigate('/')} className="px-3 py-1 rounded-lg bg-surfaceHigh text-textMuted text-xs font-medium border border-white/10 hover:bg-surface active:scale-95 transition-all">🏠 Home</button>
    </div>
  );

  const addQuestion = (type) => {
    setQuestions([...questions, { id: Date.now(), type, text: '' }]);
  };

  const updateQuestion = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hostName || !topic) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        hostName,
        topic,
        questions: questions.map(q => ({ text: q.text, type: q.type }))
      };
      const response = await api.post('/api/sessions', payload);
      // Store hostToken in localStorage for dashboard access
      if (response.data.hostToken) {
        localStorage.setItem(`hostToken_${response.data.code}`, response.data.hostToken);
      }
      navigate(`/dashboard/${response.data.code}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl mt-12 mb-20"
      >
        <Navigation />
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-3">Initialize Session</h2>
          <p className="text-textMuted">Design your atmospheric feedback environment.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-10 flex flex-col gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider text-primary uppercase">Host Identity</label>
              <input 
                type="text" 
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="What should they call you?" 
                className="w-full bg-surface border border-white/5 rounded-xl px-4 py-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider text-primary uppercase">Session Topic</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What are we discussing?" 
                className="w-full bg-surface border border-white/5 rounded-xl px-4 py-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold tracking-wider text-primary uppercase">Question Blueprint</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => addQuestion('TEXT')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface hover:bg-surfaceHigh text-xs font-medium transition-colors">
                  <AlignLeft className="w-3 h-3" /> Text
                </button>
                <button type="button" onClick={() => addQuestion('RATING')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface hover:bg-surfaceHigh text-xs font-medium transition-colors">
                  <Star className="w-3 h-3 text-tertiary" /> Rating
                </button>
              </div>
            </div>

            <AnimatePresence>
              {questions.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 border border-dashed border-white/10 rounded-xl text-textMuted">
                  No questions yet. Your session will just act as an open canvas.
                </motion.div>
              )}
              {questions.map((q, index) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="flex gap-3 items-start p-4 rounded-xl bg-surface/50 border border-white/5 relative group"
                >
                  <div className="bg-surfaceHigh px-2 py-1 rounded text-[10px] font-bold text-textMuted uppercase mt-3">
                    {q.type}
                  </div>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, e.target.value)}
                    placeholder={`Enter your ${q.type.toLowerCase()} inquiry...`}
                    className="flex-1 bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-primary mt-1"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(q.id)}
                    className="text-textMuted hover:text-red-400 p-2 opacity-50 group-hover:opacity-100 transition-opacity mt-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full relative px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-primaryContainer text-background font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Materializing...' : (
                <>Launch Session <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
