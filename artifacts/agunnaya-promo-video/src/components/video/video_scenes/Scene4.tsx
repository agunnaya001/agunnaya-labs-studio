import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // eth
      setTimeout(() => setPhase(3), 2200), // polygon
      setTimeout(() => setPhase(4), 2900), // arbitrum
      setTimeout(() => setPhase(5), 4000), // exit start
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const chains = [
    { name: 'ETHEREUM', phaseReq: 2, y: '-30vh', x: '-20vw' },
    { name: 'POLYGON', phaseReq: 3, y: '10vh', x: '25vw' },
    { name: 'ARBITRUM', phaseReq: 4, y: '30vh', x: '-15vw' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, rotateX: 45, scale: 0.8 }}
      animate={{ opacity: 1, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div 
        className="text-center absolute top-16 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      >
        <h2 className="text-5xl font-display text-white tracking-widest">MULTI-CHAIN DEPLOY</h2>
        <div className="h-1 w-24 bg-primary mx-auto mt-4 box-glow" />
      </motion.div>

      {/* Central Node */}
      <motion.div 
        className="w-32 h-32 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center z-20 absolute"
        animate={{ 
          boxShadow: ['0 0 20px rgba(0,255,65,0.2)', '0 0 60px rgba(0,255,65,0.6)', '0 0 20px rgba(0,255,65,0.2)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-display text-3xl text-primary">AGUNNAYA</span>
      </motion.div>

      {/* Chain Nodes */}
      {chains.map((chain, i) => {
        const isActive = phase >= chain.phaseReq;
        
        return (
          <motion.div
            key={chain.name}
            className="absolute flex items-center"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={phase >= 1 ? { opacity: 1, x: chain.x, y: chain.y } : { opacity: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
          >
            {/* Connection Line */}
            {phase >= 1 && (
              <svg className="absolute w-[50vw] h-[50vh] pointer-events-none -z-10" style={{ left: '50%', top: '50%', overflow: 'visible' }}>
                 {/* This is simplified for visual effect; true math lines require ref tracking, using CSS borders/lines instead below */}
              </svg>
            )}

            <div className="flex flex-col items-center">
              <motion.div 
                className="w-20 h-20 rounded-xl border flex items-center justify-center bg-bg-secondary transform rotate-45"
                initial={{ borderColor: 'rgba(107, 107, 138, 0.3)' }}
                animate={isActive ? { 
                  borderColor: '#00ff41', 
                  backgroundColor: 'rgba(0, 255, 65, 0.1)',
                  boxShadow: '0 0 30px rgba(0, 255, 65, 0.4)'
                } : {}}
              >
                <div className="transform -rotate-45 font-mono text-2xl font-bold">
                  {isActive ? <span className="text-primary">✓</span> : <span className="text-text-dim">?</span>}
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-6 px-4 py-1 border border-primary/30 bg-black/50 font-mono text-sm tracking-widest text-primary whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              >
                DEPLOYED_TO: {chain.name}
              </motion.div>
            </div>
          </motion.div>
        );
      })}

    </motion.div>
  );
}
