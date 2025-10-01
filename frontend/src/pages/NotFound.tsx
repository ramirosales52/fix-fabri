export default function NotFound() {
  return (
    <div className="loading-screen" style={{ flexDirection: 'column', gap: '12px' }}>
      <span style={{ fontSize: '1.4rem', letterSpacing: '0.2em' }}>404</span>
      <span>Página no encontrada</span>
    </div>
  );
}
