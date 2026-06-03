import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
        gap: '20px',
      }}
    >
      <h1>Bienvenido a Paz y Salvo</h1>
      <Link
        to="/dashboard/enrollment"
        style={{
          padding: '10px 20px',
          background: 'var(--primary, #1d4ed8)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        Ir al Dashboard de Matrículas
      </Link>
    </div>
  ),
});
