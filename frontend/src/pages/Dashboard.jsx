import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StopCircle, Copy, Check, BarChart2, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [responses, setResponses] = useState([]);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, TEXT, RATING

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const sessionRes = await axios.get(`http://localhost:8080/api/sessions/${code}`);
        setSession(sessionRes.data);
        
        const responsesRes = await axios.get(`http://localhost:8080/api/sessions/${code}/responses`);
        setResponses(responsesRes.data);
      } catch (err) {
        navigate('/');
      }
    };
    fetchDashboard();
    
    // Simple polling
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, [code, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStop = async () => {
    if (window.confirm('Are you sure you want to close this session?')) {
      await axios.put(`http://localhost:8080/api/sessions/${code}/stop`);
      setSession({...session, active: false});
    }
  };

  if (!session) return null;

  // Derive metrics
  const totalResponses = responses.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Navigation / Dashboard Header */}
      <div className="border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{session.topic}</h1>
            <p className="text-textMuted text-sm">Hosted by {session.hostName} </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surfaceHigh px-4 py-2 rounded-lg border border-white/5">
              <span className="text-xs text-textMuted uppercase tracking-wider">Access Code:</span>
              <span className="font-mono font-bold tracking-[0.2em]">{code}</span>
              <button onClick={handleCopy} className="ml-2 text-primary hover:text-primaryContainer transition-colors">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {session.active && (
              <button onClick={handleStop} className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/10">
                <StopCircle className="w-4 h-4" /> Stop
              </button>
            )}
            {!session.active && (
              <div className="px-4 py-2 rounded-lg bg-surfaceHigh text-textMuted text-sm border border-white/5">
                Session Closed
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8 flex flex-col">
        {/* Filters and Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-center glass-card p-4 sm:px-6 gap-4">
          <div className="flex gap-4 items-center">
            <div className="text-sm">
              <span className="text-3xl font-bold text-primary mr-2">{totalResponses}</span>
              <span className="text-textMuted">Total Responses</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilter('ALL')} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'ALL' ? "bg-primary text-background" : "bg-surface hover:bg-surfaceHigh text-textMuted")}>All</button>
            <button onClick={() => setFilter('TEXT')} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors", filter === 'TEXT' ? "bg-primary text-background" : "bg-surface hover:bg-surfaceHigh text-textMuted")}><MessageSquare className="w-3 h-3"/> Text</button>
            <button onClick={() => setFilter('RATING')} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors", filter === 'RATING' ? "bg-primary text-background" : "bg-surface hover:bg-surfaceHigh text-textMuted")}><BarChart2 className="w-3 h-3"/> Rating</button>
          </div>
        </div>

        {/* Breakdown by Question */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {session.questions.map((q) => {
            if (filter !== 'ALL' && q.type !== filter) return null;

            if (q.type === 'RATING') {
              const ratings = [1, 2, 3, 4, 5].map(v => responses.filter(r => r.answers.find(a => a.question.id === q.id && a.value === String(v))).length);
              const maxCount = Math.max(...ratings, 1);
              const barColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400'];

              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 h-fit">
                  <h3 className="font-semibold mb-6 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-textMuted"/> {q.text}</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((val, idx) => (
                      <div key={val} className="flex items-center gap-3">
                        <span className="w-4 text-sm font-bold text-textMuted">{val}</span>
                        <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(ratings[idx] / maxCount) * 100}%` }}
                            className={clsx("h-full rounded-full", barColors[idx])}
                          />
                        </div>
                        <span className="w-8 text-right text-sm text-textMuted">{ratings[idx]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            }

            if (q.type === 'TEXT') {
              const textAnswers = responses.map(r => r.answers.find(a => a.question.id === q.id)?.value).filter(Boolean);
              
              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-6 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-textMuted"/> {q.text}</h3>
                  {textAnswers.length === 0 ? (
                    <div className="text-textMuted text-sm italic py-4">No responses yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {textAnswers.map((ans, idx) => (
                        <div key={idx} className="p-4 bg-surface rounded-xl border border-white/5 text-sm leading-relaxed text-textMain/90">
                          {ans}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
