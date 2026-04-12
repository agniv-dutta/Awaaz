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
        {/* Circle 1 — largest */}
        <div
          style={{
            position: 'absolute',
            width: '900px',
            height: '900px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            right: '-200px',
            top: '-150px',
          }}
        />
        {/* Circle 2 */}
        <div
          style={{
            position: 'absolute',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.10)',
            right: '-75px',
            top: '-25px',
          }}
        />
        {/* Circle 3 */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.13)',
            right: '50px',
            top: '100px',
          }}
        />
        {/* Circle 4 — filled core */}
        <div
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            right: '150px',
            top: '200px',
          }}
        />
      </div>
    </>
  )
}
