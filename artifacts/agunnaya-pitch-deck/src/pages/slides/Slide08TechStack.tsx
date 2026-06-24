export default function Slide08TechStack() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6vh' }}>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 07</div>
            <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw' }}>TECH STACK</div>
            <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginTop: '1.2vh' }} />
          </div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw', alignSelf: 'flex-end' }}>08 / 10</div>
        </div>

        {/* 2-column grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6vw' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5vh' }}>
            <div>
              <div className="font-mono text-primary" style={{ fontSize: '2vw', letterSpacing: '0.2em', marginBottom: '1.5vh' }}>// EDITOR</div>
              <div className="font-body text-text" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '0.8vh' }}>Monaco Editor</div>
              <div className="font-body text-muted" style={{ fontSize: '2.8vw' }}>TypeScript · Vite · React</div>
            </div>

            <div>
              <div className="font-mono text-primary" style={{ fontSize: '2vw', letterSpacing: '0.2em', marginBottom: '1.5vh' }}>// AI LAYER</div>
              <div className="font-body text-text" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '0.8vh' }}>Claude 3.5 Sonnet</div>
              <div className="font-body text-muted" style={{ fontSize: '2.8vw' }}>Anthropic API · custom fine-tunes</div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5vh' }}>
            <div>
              <div className="font-mono text-primary" style={{ fontSize: '2vw', letterSpacing: '0.2em', marginBottom: '1.5vh' }}>// CHAIN LAYER</div>
              <div className="font-body text-text" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '0.8vh' }}>ethers.js · viem</div>
              <div className="font-body text-muted" style={{ fontSize: '2.8vw' }}>wagmi · Hardhat · Foundry</div>
            </div>

            <div>
              <div className="font-mono text-primary" style={{ fontSize: '2vw', letterSpacing: '0.2em', marginBottom: '1.5vh' }}>// INFRA</div>
              <div className="font-body text-text" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '0.8vh' }}>Replit · Supabase</div>
              <div className="font-body text-muted" style={{ fontSize: '2.8vw' }}>Cloudflare · IPFS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
