export default function Slide06TokenEconomy() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: '6vw', paddingRight: '6vw', paddingTop: '6vh', paddingBottom: '5vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4vh' }}>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 05</div>
            <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw' }}>AGL TOKEN ECONOMY</div>
            <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginTop: '1.2vh' }} />
          </div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw', alignSelf: 'flex-end' }}>06 / 10</div>
        </div>

        {/* 3-column tier cards */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2vw' }}>
          {/* Tier 1: Explorer */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderRadius: '2px', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', letterSpacing: '0.15em', marginBottom: '2vh' }}>TIER ONE</div>
            <div className="font-display text-text" style={{ fontSize: '4.5vw', lineHeight: '1', marginBottom: '1.5vh' }}>Explorer</div>
            <div className="font-mono text-primary" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '3vh' }}>0 AGL</div>
            <div style={{ height: '1px', background: 'rgba(0,255,65,0.15)', marginBottom: '3vh' }} />
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45', marginBottom: '1.8vh' }}>Basic Solidity editor</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45', marginBottom: '1.8vh' }}>10 AI agent calls per day</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45' }}>Single-chain deployment</div>
          </div>

          {/* Tier 2: Builder — highlighted */}
          <div style={{ background: 'rgba(0,255,65,0.05)', border: '2px solid #00ff41', borderRadius: '2px', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono text-primary" style={{ fontSize: '1.8vw', letterSpacing: '0.15em', marginBottom: '2vh' }}>TIER TWO</div>
            <div className="font-display text-text" style={{ fontSize: '4.5vw', lineHeight: '1', marginBottom: '1.5vh' }}>Builder</div>
            <div className="font-mono text-primary" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '3vh' }}>1,000 AGL</div>
            <div style={{ height: '1px', background: 'rgba(0,255,65,0.3)', marginBottom: '3vh' }} />
            <div className="font-body text-text" style={{ fontSize: '2.6vw', lineHeight: '1.45', marginBottom: '1.8vh' }}>All 8 AI specialists</div>
            <div className="font-body text-text" style={{ fontSize: '2.6vw', lineHeight: '1.45', marginBottom: '1.8vh' }}>Unlimited agent calls</div>
            <div className="font-body text-text" style={{ fontSize: '2.6vw', lineHeight: '1.45' }}>5-chain deployment</div>
          </div>

          {/* Tier 3: Protocol */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderRadius: '2px', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', letterSpacing: '0.15em', marginBottom: '2vh' }}>TIER THREE</div>
            <div className="font-display text-text" style={{ fontSize: '4.5vw', lineHeight: '1', marginBottom: '1.5vh' }}>Protocol</div>
            <div className="font-mono text-accent" style={{ fontSize: '3.2vw', fontWeight: 700, marginBottom: '3vh' }}>10,000 AGL</div>
            <div style={{ height: '1px', background: 'rgba(0,255,65,0.15)', marginBottom: '3vh' }} />
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45', marginBottom: '1.8vh' }}>Team seats + white-label</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45', marginBottom: '1.8vh' }}>All chains + priority support</div>
            <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45' }}>DAO governance rights</div>
          </div>
        </div>
      </div>
    </div>
  );
}
