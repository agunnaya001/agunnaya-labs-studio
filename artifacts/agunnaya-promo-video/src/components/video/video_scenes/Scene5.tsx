import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Detecting...
      setTimeout(() => setPhase(3), 2500), // Unlocked
      setTimeout(() => setPhase(4), 4000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10 bg-bg-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8 }}
    >
      
      {/* Background Rings */}
      <motion.div 
        className="absolute w-[60vh] h-[60vh] rounded-full border border-primary/20"
        animate={phase >= 3 ? { scale: [1, 1.5], opacity: [0.5, 0] } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.5, repeat: phase >= 3 ? Infinity : 0 }}
      />

      <div className="flex flex-col items-center">
        {/* Lock / Unlock Icon Container */}
        <motion.div 
          className="w-40 h-40 rounded-full border-4 flex items-center justify-center mb-8 relative bg-bg-secondary"
          initial={{ borderColor: '#6b6b8a' }}
          animate={phase >= 3 ? { borderColor: '#00ff41', boxShadow: '0 0 50px rgba(0,255,65,0.4)' } : { borderColor: '#6b6b8a' }}
          transition={{ duration: 0.5 }}
        >
          {/* Lock Shackle */}
          <motion.div 
            className="w-16 h-20 border-4 rounded-t-full absolute top-4"
            initial={{ borderColor: '#6b6b8a', y: 0 }}
            animate={phase >= 3 ? { borderColor: '#00ff41', y: -20, rotate: 15, transformOrigin: 'right bottom' } : { borderColor: '#6b6b8a', y: 0 }}
            style={{ clipPath: 'inset(0 0 50% 0)' }}
            transition={{ duration: 0.5, type: 'spring' }}
          />
          {/* Lock Body */}
          <motion.div 
            className="w-20 h-16 bg-text-dim rounded flex items-center justify-center z-10"
            animate={phase >= 3 ? { backgroundColor: '#00ff41' } : { backgroundColor: '#6b6b8a' }}
          >
            <div className="w-4 h-4 rounded-full bg-bg-base" />
          </motion.div>
        </motion.div>

        {/* Text Area */}
        <div className="h-24 flex flex-col items-center justify-center">
          {phase === 1 && (
            <motion.p 
              className="font-mono text-xl text-text-dim tracking-widest"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              SCANNING WALLET...
            </motion.p>
          )}
          {phase === 2 && (
            <motion.p 
              className="font-mono text-xl text-accent tracking-widest"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              AGL TOKEN DETECTED
            </motion.p>
          )}
          {phase >= 3 && (
            <motion.h2 
              className="text-7xl font-display text-primary text-glow tracking-widest"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              ACCESS GRANTED
            </motion.h2>
          )}
        </div>

        {/* Pro Tier Tag */}
        {phase >= 3 && (
          <motion.div 
            className="mt-6 px-6 py-2 border border-primary bg-primary/10 text-primary font-mono tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            PRO TIER UNLOCKED
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
