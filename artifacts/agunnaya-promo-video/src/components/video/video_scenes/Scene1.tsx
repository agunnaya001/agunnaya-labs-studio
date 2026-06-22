import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 4000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.2 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        {/* Outline / Glitch layers */}
        <motion.h1 
          className="text-[12vw] font-display text-primary text-glow leading-none tracking-wider text-center"
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={phase >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 50, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          AGUNNAYA
        </motion.h1>
        
        {/* Flicker effect over the text */}
        {phase >= 1 && phase < 3 && (
          <motion.div 
            className="absolute inset-0 bg-primary mix-blend-overlay"
            animate={{ opacity: [0, 0.8, 0, 0.5, 0, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1], repeat: Infinity, repeatDelay: 2 }}
          />
        )}
      </div>

      <motion.div
        className="mt-6 border border-primary/50 bg-primary/10 px-8 py-3 backdrop-blur-md"
        initial={{ opacity: 0, width: 0 }}
        animate={phase >= 2 ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        <p className="font-mono text-xl tracking-[0.3em] text-primary">
          [ AI STUDIO ]
        </p>
      </motion.div>
    </motion.div>
  );
}
