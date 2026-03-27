'use client';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
        background: '#0b1020',
        color: '#f8fafc',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.85 }}>
          The application hit an unexpected error while rendering this page.
        </p>
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          {error?.digest ? `Error ID: ${error.digest}` : ''}
        </p>
      </div>
    </main>
  );
}
