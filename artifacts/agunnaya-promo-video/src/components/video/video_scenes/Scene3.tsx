import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);
  const [charsTyped, setCharsTyped] = useState(0);

  const codeSnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IAgunnayaAgent.sol";

contract AgunnayaRegistry is Ownable {
    mapping(bytes32 => address) public activeAgents;
    
    event AgentDeployed(bytes32 indexed id, address addr);

    function deployAgent(bytes32 _id, bytes calldata _config) external onlyOwner {
        address newAgent = address(new AgunnayaAgent(_config));
        activeAgents[_id] = newAgent;
        emit AgentDeployed(_id, newAgent);
    }
}`;

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000), // Start typing
      setTimeout(() => setPhase(3), 5000), // End scene
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (phase === 2) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < codeSnippet.length) {
          setCharsTyped(prev => prev + 4);
          current += 4;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [phase, codeSnippet.length]);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10 px-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      
      <div className="w-full max-w-5xl rounded-xl border border-primary/20 bg-[#0f0f17]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Editor Header */}
        <div className="flex items-center px-4 py-3 border-b border-primary/20 bg-black/40">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-primary/50" />
          </div>
          <div className="mx-auto font-mono text-xs text-text-dim tracking-widest">
            AgunnayaRegistry.sol
          </div>
        </div>

        {/* Editor Body */}
        <div className="p-8 h-[50vh] overflow-hidden relative font-mono text-sm leading-relaxed text-text-primary">
          <pre className="m-0 p-0">
            <code className="whitespace-pre-wrap break-words">
              <span className="text-text-dim">
                {codeSnippet.substring(0, Math.min(charsTyped, 56))}
              </span>
              <span className="text-primary">
                {codeSnippet.substring(56, charsTyped)}
              </span>
            </code>
          </pre>
          
          {/* Cursor */}
          {phase >= 2 && charsTyped < codeSnippet.length && (
            <motion.span 
              className="inline-block w-2 h-4 bg-primary align-middle ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      </div>
      
      {/* Overlay Title */}
      <motion.div 
        className="absolute bottom-16 right-16"
        initial={{ opacity: 0, x: 50 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-6xl font-display text-primary text-glow drop-shadow-lg text-right">
          NATIVE<br/>SOLIDITY EDITOR
        </h2>
      </motion.div>
    </motion.div>
  );
}
