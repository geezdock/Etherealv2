import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function Navigation({ className = "mb-8" }) {
  const navigate = useNavigate();

  const NavButton = ({ onClick, icon: Icon, label }) => (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative group p-3 rounded-full bg-surfaceHigh/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-surfaceHigh/60 hover:border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      title={label}
    >
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-primary/20 -z-10" />
      
      <Icon className="w-5 h-5 text-textMuted group-hover:text-primary transition-colors duration-300" />
    </motion.button>
  );

  return (
    <div className={`flex gap-4 ${className}`}>
      <NavButton 
        onClick={() => navigate(-1)} 
        icon={ArrowLeft} 
        label="Back" 
      />
      <NavButton 
        onClick={() => navigate('/')} 
        icon={Home} 
        label="Home" 
      />
    </div>
  );
}
