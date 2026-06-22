import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000), // Start sequence
      setTimeout(() => setPhase(3), 5000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const agents = [
    { id: '0x01', role: 'DEFISWAP' },
    { id: '0x02', role: 'AUDITOR' },
    { id: '0x03', role: 'DEPLOYER' },
    { id: '0x04', role: 'ARBITRAGE' },
    { id: '0x05', role: 'ORACLE' },
    { id: '0x06', role: 'GOVERNANCE' },
    { id: '0x07', role: 'BRIDGER' },
    { id: '0x08', role: 'LIQUIDITY' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full max-w-6xl mb-12 flex justify-between items-end border-b border-primary/30 pb-4">
        <motion.h2 
          className="text-5xl font-display tracking-widest text-primary"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        >
          AUTONOMOUS AGENTS
        </motion.h2>
        <motion.p 
          className="font-mono text-text-dim text-sm"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        >
          SYSTEM_STATUS: ONLINE
        </motion.p>
      </div>

      <div className="grid grid-cols-4 gap-6 w-full max-w-6xl">
        {agents.map((agent, i) => {
          const isActive = phase >= 2;
          const delay = isActive ? i * 0.3 : 0; // Staggered activation
          
          return (
            <motion.div
              key={agent.id}
              className="border p-6 relative overflow-hidden bg-bg-secondary"
              initial={{ borderColor: 'rgba(107, 107, 138, 0.2)' }}
              animate={isActive ? { 
                borderColor: 'rgba(0, 255, 65, 0.8)',
                backgroundColor: 'rgba(0, 255, 65, 0.05)',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)'
              } : {}}
              transition={{ delay, duration: 0.4 }}
            >
              {/* Scanline effect on active */}
              {isActive && (
                <motion.div 
                  className="absolute left-0 right-0 h-[2px] bg-primary/50"
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ delay, duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-text-dim">{agent.id}</span>
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  initial={{ backgroundColor: 'rgba(107, 107, 138, 0.5)' }}
                  animate={isActive ? { backgroundColor: '#00ff41', boxShadow: '0 0 8px #00ff41' } : {}}
                  transition={{ delay, duration: 0.2 }}
                />
              </div>
              <motion.h3 
                className="font-display text-2xl tracking-wide text-text-primary"
                animate={isActive ? { color: '#e0e0f0' } : { color: '#6b6b8a' }}
                transition={{ delay }}
              >
                {agent.role}
              </motion.h3>
              
              <motion.p
                className="font-mono text-[10px] mt-4 opacity-0 text-primary"
                animate={isActive ? { opacity: 0.8 } : { opacity: 0 }}
                transition={{ delay: delay + 0.2 }}
              >
                &gt; init seq_{i}... OK
              </motion.p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
