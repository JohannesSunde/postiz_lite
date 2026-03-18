import * as Sentry from '@sentry/nestjs';
import { capitalize } from 'lodash';

export const initializeSentry = (appName: string, allowLogs = false) => {
  const heavyFeaturesEnabled = process.env.POSTIZ_ENABLE_HEAVY_FEATURES === 'true';

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return null;
  }

  try {
    const nodeProfilingIntegration = heavyFeaturesEnabled
      ? require('@sentry/profiling-node').nodeProfilingIntegration
      : null;

    Sentry.init({
      initialScope: {
        tags: {
          service: appName,
          component: 'nestjs',
        },
        contexts: {
          app: {
            name: `Postiz ${capitalize(appName)}`,
          },
        },
      },
      environment: process.env.NODE_ENV || 'development',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      spotlight: heavyFeaturesEnabled && process.env.SENTRY_SPOTLIGHT === '1',
      integrations: [
        ...(heavyFeaturesEnabled && nodeProfilingIntegration
          ? [nodeProfilingIntegration()]
          : []),
        ...(allowLogs
          ? [
              Sentry.consoleLoggingIntegration({
                levels: ['log', 'info', 'warn', 'error', 'debug', 'assert', 'trace'],
              }),
            ]
          : []),
        ...(heavyFeaturesEnabled
          ? [
              Sentry.openAIIntegration({
                recordInputs: true,
                recordOutputs: true,
              }),
            ]
          : []),
      ],
      tracesSampleRate: heavyFeaturesEnabled ? 1.0 : 0,
      enableLogs: allowLogs && heavyFeaturesEnabled,

      // Profiling
      profileSessionSampleRate: heavyFeaturesEnabled
        ? process.env.NODE_ENV === 'development'
          ? 1.0
          : 0.45
        : 0,
      profileLifecycle: heavyFeaturesEnabled ? 'trace' : 'manual',
    });
  } catch (err) {
    console.log(err);
  }
  return true;
};
