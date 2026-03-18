'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const { sentryDsn } = useVariables();

  useEffect(() => {
    if (!sentryDsn) {
      return;
    }
    const eventId = Sentry.captureException(error);
    Sentry.showReportDialog({
      eventId,
      title: 'Something broke!',
      subtitle: 'Please help us fix the issue by providing some details.',
      labelComments: 'What happened?',
      labelName: 'Your name',
      labelEmail: 'Your email',
      labelSubmit: 'Send Report',
      lang: 'en',
    });

  }, [error, sentryDsn]);
  return (
    <html lang="en">
      <body>
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
              The application hit an unexpected error while rendering this
              page.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
