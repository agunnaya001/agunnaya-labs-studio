export default function Slide07MultiChain() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />

      <div className="absolute inset-0 flex" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}>
        {/* Left: heading + description */}
        <div style={{ width: '38vw', marginRight: '6vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>SECTION 06</div>
            <div className="font-display text-text leading-none" style={{ fontSize: '5.5vw', marginBottom: '2vh' }}>MULTI-CHAIN DEPLOYMENT</div>
            <div style={{ width: '5vw', height: '2px', background: '#00ff41', marginBottom: '4vh' }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', lineHeight: '1.4', marginBottom: '3vh', fontWeight: 700 }}>
              One codebase. One command. Any network.
            </div>
            <div className="font-body text-muted" style={{ fontSize: '2.8vw', lineHeight: '1.55' }}>
              Agunnaya manages RPC endpoints, verification APIs, and constructor arguments per chain — deploy to six networks in the time it takes to deploy to one.
            </div>
          </div>
          <div className="font-mono text-muted" style={{ fontSize: '1.8vw' }}>07 / 10</div>
        </div>

        {/* Right: chain list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#0f0f17', border: '1px solid rgba(0,255,65,0.14)', padding: '2.3vh 2.5vw', borderRadius: '2px', gap: '2vw' }}>
            <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, flex: 1 }}>Ethereum</div>
            <div className="font-mono text-primary" style={{ fontSize: '2.2vw' }}>MAINNET</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#0f0f17', border: '1px solid rgba(0,255,65,0.14)', padding: '2.3vh 2.5vw', borderRadius: '2px', gap: '2vw' }}>
            <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, flex: 1 }}>Polygon</div>
            <div className="font-mono text-primary" style={{ fontSize: '2.2vw' }}>MAINNET</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#0f0f17', border: '1px solid rgba(0,255,65,0.14)', padding: '2.3vh 2.5vw', borderRadius: '2px', gap: '2vw' }}>
            <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, flex: 1 }}>Arbitrum</div>
            <div className="font-mono text-primary" style={{ fontSize: '2.2vw' }}>ONE + NOVA</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#0f0f17', border: '1px solid rgba(0,255,65,0.14)', padding: '2.3vh 2.5vw', borderRadius: '2px', gap: '2vw' }}>
            <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, flex: 1 }}>Base</div>
            <div className="font-mono text-primary" style={{ fontSize: '2.2vw' }}>MAINNET</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#0f0f17', border: '1px solid rgba(0,255,65,0.14)', padding: '2.3vh 2.5vw', borderRadius: '2px', gap: '2vw' }}>
            <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, flex: 1 }}>Optimism</div>
            <div className="font-mono text-primary" style={{ fontSize: '2.2vw' }}>MAINNET</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#0f0f17', border: '1px solid rgba(0,255,65,0.14)', padding: '2.3vh 2.5vw', borderRadius: '2px', gap: '2vw' }}>
            <div style={{ width: '1.2vw', height: '1.2vw', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
            <div className="font-body text-text" style={{ fontSize: '3vw', fontWeight: 700, flex: 1 }}>zkSync Era</div>
            <div className="font-mono text-primary" style={{ fontSize: '2.2vw' }}>MAINNET</div>
          </div>
        </div>
      </div>
    </div>
  );
}
