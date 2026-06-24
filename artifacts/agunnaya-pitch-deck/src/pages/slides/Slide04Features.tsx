export default function Slide04Features() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}>
        {/* Left: heading + terminal */}
        <div style={{ width: '44vw', marginRight: '4vw', display: 'flex', flexDirection: 'column' }}>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 03</div>
          <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw', marginBottom: '2vh' }}>PRODUCT FEATURES</div>
          <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginBottom: '4vh' }} />

          {/* Terminal panel */}
          <div style={{ flex: 1, background: '#0f0f17', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#13131e', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
              <div style={{ width: '1vw', height: '1vw', borderRadius: '50%', background: 'rgba(255,51,85,0.6)' }} />
              <div style={{ width: '1vw', height: '1vw', borderRadius: '50%', background: 'rgba(255,204,0,0.6)' }} />
              <div style={{ width: '1vw', height: '1vw', borderRadius: '50%', background: 'rgba(0,255,65,0.6)' }} />
              <div className="font-mono text-muted" style={{ fontSize: '1.6vw', marginLeft: '0.8vw' }}>agunnaya — studio@main</div>
            </div>
            <div className="font-mono" style={{ padding: '2vh 1.8vw', fontSize: '1.9vw', lineHeight: '2.1', flex: 1 }}>
              <div><span style={{ color: '#00ff41' }}>$</span> <span className="text-text">agn compile --optimize</span></div>
              <div style={{ color: '#6b6b8a' }}>✓ Compiled 3 contracts (0.1s)</div>
              <div style={{ color: '#6b6b8a' }}>✓ Gas report generated</div>
              <div style={{ marginTop: '0.5vh' }}><span style={{ color: '#00ff41' }}>$</span> <span className="text-text">agn agent audit</span></div>
              <div style={{ color: '#6b6b8a' }}>Scanning for vulnerabilities...</div>
              <div style={{ color: '#a3ff47' }}>✓ No critical issues found</div>
              <div style={{ marginTop: '0.5vh' }}><span style={{ color: '#00ff41' }}>$</span> <span className="text-text">agn deploy --chain arbitrum</span></div>
              <div style={{ color: '#a3ff47' }}>✓ Deployed: 0x1a2b...3c4d</div>
            </div>
          </div>
        </div>

        {/* Right: feature list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '4vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.8vw', fontWeight: 700, flexShrink: 0, lineHeight: '1', marginTop: '0.2vh' }}>01</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.6vh' }}>AI co-pilot in context</div>
                <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Completions specific to your contract logic, not generic code</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '4vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.8vw', fontWeight: 700, flexShrink: 0, lineHeight: '1', marginTop: '0.2vh' }}>02</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.6vh' }}>Gas estimation before deploy</div>
                <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Real-time cost projections per function and per network</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '4vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.8vw', fontWeight: 700, flexShrink: 0, lineHeight: '1', marginTop: '0.2vh' }}>03</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.6vh' }}>Integrated test runner</div>
                <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Write, run, and track coverage without leaving the IDE</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.8vw', fontWeight: 700, flexShrink: 0, lineHeight: '1', marginTop: '0.2vh' }}>04</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.6vh' }}>Cross-chain contract explorer</div>
                <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Browse all deployed contracts across every supported network</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5vh' }}>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw' }}>04 / 10</div>
          </div>
        </div>
      </div>
    </div>
  );
}
