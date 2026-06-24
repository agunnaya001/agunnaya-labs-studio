export default function Slide05Agents() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: '6vw', paddingRight: '6vw', paddingTop: '5.5vh', paddingBottom: '5vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3vh' }}>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 04</div>
            <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw' }}>8 AI SPECIALISTS</div>
            <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginTop: '1.2vh' }} />
          </div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw', alignSelf: 'flex-end' }}>05 / 10</div>
        </div>

        {/* 4x2 Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1.5vw' }}>
          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-01</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Auditor</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Finds vulnerabilities before deployment</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-02</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Gas Optimizer</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Reduces transaction costs per function</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-03</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Test Writer</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Generates unit and integration tests</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-04</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Doc Generator</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Writes NatSpec and API documentation</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-05</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>ABI Decoder</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Translates contract interfaces to plain English</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-06</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Chain Advisor</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Recommends optimal deployment networks</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-07</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Migration Agent</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Upgrades legacy contracts to current standards</div>
          </div>

          <div style={{ background: '#0f0f17', border: '1px solid rgba(0,255,65,0.12)', borderLeft: '3px solid #00ff41', padding: '2.5vh 1.8vw', borderRadius: '2px' }}>
            <div className="font-mono text-primary" style={{ fontSize: '2vw', marginBottom: '1vh' }}>AGT-08</div>
            <div className="font-body text-text" style={{ fontSize: '2.8vw', fontWeight: 700, lineHeight: '1.15', marginBottom: '1vh' }}>Monitor</div>
            <div className="font-body text-muted" style={{ fontSize: '2.5vw', lineHeight: '1.4' }}>Watches live contracts for anomalies</div>
          </div>
        </div>
      </div>
    </div>
  );
}
