/**
 * BackgroundLayer — fixed gradient + concentric circle decoration.
 * Rendered once in App.tsx, sits behind all page content (z-index 0 & 1).
 */
export function BackgroundLayer() {
  return (
    <>
      {/* Gradient fill — covers entire viewport */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 65% 35%, #FF9E00 0%, #E85D00 25%, #9B3000 50%, #1A1A1A 85%)',
          pointerEvents: 'none',
        }}
      />

      {/* Concentric circle decoration */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          right: '-180px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Circle 1 — outermost (1000px) */}
          <div
            style={{
              position: 'absolute',
              width: '1000px',
              height: '1000px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          />
          {/* Circle 2 (720px) */}
          <div
            style={{
              position: 'absolute',
              width: '720px',
              height: '720px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
          />
          {/* Circle 3 (480px) */}
          <div
            style={{
              position: 'absolute',
              width: '480px',
              height: '480px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
          {/* Circle 4 — innermost (280px) */}
          <div
            style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.025)',
            }}
          />
        </div>
      </div>
    </>
  )
}
