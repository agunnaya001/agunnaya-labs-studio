export default function Slide02Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}>
        {/* Left: section number */}
        <div className="flex flex-col justify-between" style={{ width: '18vw', marginRight: '5vw' }}>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '1vh' }}>SECTION</div>
            <div className="font-display text-primary leading-none" style={{ fontSize: '18vw', lineHeight: '0.85' }}>01</div>
          </div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw' }}>02 / 10</div>
        </div>

        {/* Right: content */}
        <div className="flex flex-col justify-center" style={{ flex: 1 }}>
          <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw', marginBottom: '1.5vh' }}>THE PROBLEM</div>
          <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginBottom: '5vh' }} />

          <div style={{ marginBottom: '4.5vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.2vw', flexShrink: 0, marginTop: '0.2vh' }}>—</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.8vh' }}>Tooling is scattered</div>
                <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45' }}>Hardhat, Foundry, Remix, and custom scripts each live in a separate tab — no unified workflow</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '4.5vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.2vw', flexShrink: 0, marginTop: '0.2vh' }}>—</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.8vh' }}>No AI in the Web3 stack</div>
                <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45' }}>Generic code assistants lack Solidity context, gas mechanics, and chain-specific knowledge</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5vw' }}>
              <div className="font-mono text-primary" style={{ fontSize: '2.2vw', flexShrink: 0, marginTop: '0.2vh' }}>—</div>
              <div>
                <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, lineHeight: '1.2', marginBottom: '0.8vh' }}>Deployment is manual</div>
                <div className="font-body text-muted" style={{ fontSize: '2.6vw', lineHeight: '1.45' }}>Each chain requires separate configuration and verification steps — repeated for every network</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
