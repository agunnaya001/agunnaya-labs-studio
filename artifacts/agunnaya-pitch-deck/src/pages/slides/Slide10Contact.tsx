export default function Slide10Contact() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 deck-grid" />
      <div className="absolute pointer-events-none" style={{ width: '80vw', height: '80vh', background: 'radial-gradient(ellipse, rgba(0,255,65,0.07) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, #00ff41 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, transparent 40%, #00ff41 100%)' }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingLeft: '8vw', paddingRight: '8vw' }}>
        <div className="font-mono text-primary tracking-widest" style={{ fontSize: '1.8vw', letterSpacing: '0.3em', marginBottom: '3vh' }}>
          BUILD WITH AGUNNAYA
        </div>
        <div className="font-display text-text leading-none tracking-tight text-center" style={{ fontSize: '9vw', lineHeight: '0.9', marginBottom: '1.5vh' }}>
          AGUNNAYA
        </div>
        <div className="font-display text-primary leading-none tracking-tight text-center" style={{ fontSize: '9vw', lineHeight: '0.9', marginBottom: '4vh' }}>
          AI STUDIO
        </div>
        <div style={{ width: '8vw', height: '2px', background: '#00ff41', marginBottom: '4vh' }} />
        <div className="font-body text-muted text-center" style={{ fontSize: '2.8vw', maxWidth: '52vw', lineHeight: '1.5', marginBottom: '6vh' }}>
          AI-native Solidity IDE · 8 specialized agents · Multi-chain deployment · AGL token-gated access
        </div>

        <div style={{ display: 'flex', gap: '6vw', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>WEBSITE</div>
            <div className="font-body text-primary" style={{ fontSize: '3vw', fontWeight: 700 }}>agunnaya.io</div>
          </div>
          <div style={{ width: '1px', height: '8vh', background: 'rgba(0,255,65,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>CONTACT</div>
            <div className="font-body text-primary" style={{ fontSize: '3vw', fontWeight: 700 }}>studio@agunnaya.io</div>
          </div>
          <div style={{ width: '1px', height: '8vh', background: 'rgba(0,255,65,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono text-muted" style={{ fontSize: '1.8vw', marginBottom: '0.8vh' }}>TWITTER</div>
            <div className="font-body text-primary" style={{ fontSize: '3vw', fontWeight: 700 }}>@agunnaya_io</div>
          </div>
        </div>
      </div>

      <div className="absolute font-mono text-muted" style={{ bottom: '4vh', right: '6vw', fontSize: '1.8vw' }}>10 / 10</div>
    </div>
  );
}
