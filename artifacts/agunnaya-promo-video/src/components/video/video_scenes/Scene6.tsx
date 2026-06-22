import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-bg-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-16">
        <motion.h2 
          className="text-[6vw] font-display text-white leading-none tracking-wide"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={phase >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
        >
          BUILD SMARTER.
        </motion.h2>
        <motion.h2 
          className="text-[6vw] font-display text-white leading-none tracking-wide"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
        >
          DEPLOY FASTER.
        </motion.h2>
        <motion.h2 
          className="text-[6vw] font-display text-primary text-glow leading-none tracking-wide"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={phase >= 3 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
        >
          OWN THE CHAIN.
        </motion.h2>
      </div>

      <motion.div
        className="mt-8 border-t border-primary/30 pt-8 w-full max-w-2xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="text-4xl font-display text-text-dim tracking-[0.5em]">AGUNNAYA AI STUDIO</h1>
        <p className="mt-4 font-mono text-primary/70 text-sm">agunnaya.ai</p>
      </motion.div>

    </motion.div>
  );
}
