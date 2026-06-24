export default function Slide09Roadmap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: '6vw', paddingRight: '6vw', paddingTop: '6vh', paddingBottom: '5vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4vh' }}>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 08</div>
            <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw' }}>ROADMAP</div>
            <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginTop: '1.2vh' }} />
          </div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw', alignSelf: 'flex-end' }}>09 / 10</div>
        </div>

        {/* Timeline connector */}
        <div style={{ position: 'relative', marginBottom: '2.5vh', height: '1.5vw' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'rgba(0,255,65,0.2)', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2vw' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '1.4vw', height: '1.4vw', borderRadius: '50%', background: '#00ff41' }} /></div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '1.4vw', height: '1.4vw', borderRadius: '50%', background: '#00ff41' }} /></div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '1.4vw', height: '1.4vw', borderRadius: '50%', background: 'rgba(0,255,65,0.45)', border: '2px solid rgba(0,255,65,0.5)' }} /></div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '1.4vw', height: '1.4vw', borderRadius: '50%', background: 'rgba(0,255,65,0.2)', border: '2px solid rgba(0,255,65,0.3)' }} /></div>
          </div>
        </div>

        {/* Phase columns */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2vw' }}>
          {/* Phase 1 */}
          <div style={{ background: 'rgba(0,255,65,0.07)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '2px', padding: '2.5vh 2vw' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', fontWeight: 700, marginBottom: '2vh' }}>Q3 2026</div>
            <div className="font-display text-text" style={{ fontSize: '3.2vw', lineHeight: '1.1', marginBottom: '2.5vh' }}>Public Beta</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>Core Solidity IDE live</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>3 AI agents shipped</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45' }}>EVM chain support</div>
          </div>

          {/* Phase 2 */}
          <div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.22)', borderRadius: '2px', padding: '2.5vh 2vw' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', fontWeight: 700, marginBottom: '2vh' }}>Q4 2026</div>
            <div className="font-display text-text" style={{ fontSize: '3.2vw', lineHeight: '1.1', marginBottom: '2.5vh' }}>Token Launch</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>AGL token goes live</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>Full 8-agent suite</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45' }}>10+ chain support</div>
          </div>

          {/* Phase 3 */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderRadius: '2px', padding: '2.5vh 2vw' }}>
            <div className="font-mono text-muted" style={{ fontSize: '2vw', fontWeight: 700, marginBottom: '2vh' }}>Q1 2027</div>
            <div className="font-display text-text" style={{ fontSize: '3.2vw', lineHeight: '1.1', marginBottom: '2.5vh' }}>Mobile IDE</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>iOS + Android editor</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>Audit marketplace</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45' }}>DAO governance</div>
          </div>

          {/* Phase 4 */}
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.08)', borderRadius: '2px', padding: '2.5vh 2vw' }}>
            <div className="font-mono text-muted" style={{ fontSize: '2vw', fontWeight: 700, marginBottom: '2vh' }}>Q2 2027</div>
            <div className="font-display text-text" style={{ fontSize: '3.2vw', lineHeight: '1.1', marginBottom: '2.5vh' }}>Protocol SDK</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>White-label partnerships</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45', marginBottom: '1.5vh' }}>L2 native integrations</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.45' }}>Enterprise onboarding</div>
          </div>
        </div>
      </div>
    </div>
  );
}
