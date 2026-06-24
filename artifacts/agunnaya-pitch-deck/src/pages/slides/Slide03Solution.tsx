export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: '6vw', paddingRight: '6vw', paddingTop: '6vh', paddingBottom: '5vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '4vh' }}>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 02</div>
          <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw' }}>THE SOLUTION</div>
          <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginTop: '1.2vh' }} />
        </div>

        {/* 3-column feature blocks */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2.5vw' }}>
          {/* Column 1: Editor */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.15)', borderTop: '3px solid #00ff41', padding: '3.5vh 2.5vw', borderRadius: '2px', display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono text-primary" style={{ fontSize: '1.8vw', letterSpacing: '0.15em', marginBottom: '2vh' }}>// EDITOR</div>
            <div className="font-display text-text" style={{ fontSize: '4.2vw', lineHeight: '1', marginBottom: '2.5vh' }}>Native IDE</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.5' }}>VSCode-grade Solidity editor with inline AI completions, hover docs, and live error detection — no extensions needed</div>
          </div>

          {/* Column 2: Agents */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.15)', borderTop: '3px solid #00ff41', padding: '3.5vh 2.5vw', borderRadius: '2px', display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono text-primary" style={{ fontSize: '1.8vw', letterSpacing: '0.15em', marginBottom: '2vh' }}>// AGENTS</div>
            <div className="font-display text-text" style={{ fontSize: '4.2vw', lineHeight: '1', marginBottom: '2.5vh' }}>8 Specialists</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.5' }}>Purpose-built agents for audit, gas optimization, test generation, documentation, and live contract monitoring</div>
          </div>

          {/* Column 3: Deploy */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.15)', borderTop: '3px solid #00ff41', padding: '3.5vh 2.5vw', borderRadius: '2px', display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono text-primary" style={{ fontSize: '1.8vw', letterSpacing: '0.15em', marginBottom: '2vh' }}>// DEPLOY</div>
            <div className="font-display text-text" style={{ fontSize: '4.2vw', lineHeight: '1', marginBottom: '2.5vh' }}>One-click</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.5' }}>From code to mainnet in seconds across Ethereum, Polygon, Arbitrum, Base, Optimism, and zkSync</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5vh' }}>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw' }}>agunnaya.io</div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw' }}>03 / 10</div>
        </div>
      </div>
    </div>
  );
}
