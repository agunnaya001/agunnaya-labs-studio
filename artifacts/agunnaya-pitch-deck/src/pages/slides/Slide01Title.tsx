export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute pointer-events-none" style={{ width: '80vw', height: '80vh', background: 'radial-gradient(ellipse, rgba(0,255,65,0.06) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}>
        {/* Left: hero text */}
        <div className="flex flex-col justify-center" style={{ width: '48vw', marginRight: '4vw' }}>
          <div className="font-mono text-primary tracking-widest" style={{ fontSize: '1.8vw', letterSpacing: '0.3em', marginBottom: '2.5vh' }}>
            AGUNNAYA SYSTEMS INC.
          </div>
          <div className="font-display text-text leading-none tracking-tight" style={{ fontSize: '11vw', lineHeight: '0.92' }}>
            AGUNNAYA
          </div>
          <div className="font-display text-primary leading-none tracking-tight" style={{ fontSize: '11vw', lineHeight: '0.92', marginBottom: '3vh' }}>
            AI STUDIO
          </div>
          <div style={{ width: '6vw', height: '2px', background: '#00ff41', marginBottom: '3vh' }} />
          <div className="font-body text-muted" style={{ fontSize: '2.4vw', lineHeight: '1.5', maxWidth: '38vw' }}>
            AI-native IDE for Solidity development, multi-chain deployment, and Web3 automation
          </div>
        </div>

        {/* Right: terminal panel */}
        <div className="flex flex-col justify-center" style={{ flex: 1 }}>
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.22)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ background: '#13131e', padding: '1.8vh 1.8vw', display: 'flex', alignItems: 'center', gap: '0.7vw', borderBottom: '1px solid rgba(0,255,65,0.12)' }}>
              <div style={{ width: '1.1vw', height: '1.1vw', borderRadius: '50%', background: 'rgba(255,51,85,0.55)' }} />
              <div style={{ width: '1.1vw', height: '1.1vw', borderRadius: '50%', background: 'rgba(255,204,0,0.55)' }} />
              <div style={{ width: '1.1vw', height: '1.1vw', borderRadius: '50%', background: 'rgba(0,255,65,0.55)' }} />
              <div className="font-mono text-muted" style={{ fontSize: '1.7vw', marginLeft: '0.8vw' }}>agunnaya.sol</div>
            </div>
            <div className="font-mono" style={{ padding: '2.5vh 2vw', fontSize: '1.9vw', lineHeight: '2' }}>
              <div><span style={{ color: '#00ff41' }}>import</span> <span style={{ color: '#a3ff47' }}>"./IAgents.sol"</span><span className="text-text">;</span></div>
              <div style={{ marginTop: '0.5vh' }}><span style={{ color: '#00ff41' }}>contract</span> <span className="text-text">Registry is</span></div>
              <div style={{ marginLeft: '2vw' }}><span style={{ color: '#a3ff47' }}>Ownable, IAgents</span> <span className="text-text">{'{'}</span></div>
              <div style={{ marginLeft: '2vw', marginTop: '0.5vh' }}><span style={{ color: '#00ff41' }}>// 8 AI Specialists</span></div>
              <div style={{ marginLeft: '2vw' }}><span style={{ color: '#00ff41' }}>// Multi-chain deploy</span></div>
              <div style={{ marginLeft: '2vw' }}><span style={{ color: '#00ff41' }}>// AGL-gated access</span></div>
              <div style={{ marginTop: '0.5vh' }} className="text-text">{'}'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute font-mono text-muted" style={{ bottom: '4vh', left: '7vw', fontSize: '1.8vw' }}>2026</div>
      <div className="absolute font-mono text-muted" style={{ bottom: '4vh', right: '7vw', fontSize: '1.8vw' }}>01 / 10</div>
    </div>
  );
}
