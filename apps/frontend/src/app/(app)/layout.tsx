export const dynamic = 'force-dynamic';
import { SentryComponent } from '@gitroom/frontend/components/layout/sentry.component';
import LayoutContext from '@gitroom/frontend/components/layout/layout.context';
import { ReactNode } from 'react';
import PlausibleProvider from 'next-plausible';
import { VariableContextComponent } from '@gitroom/react/helpers/variable.context';
import { PHProvider } from '@gitroom/react/helpers/posthog';
import UtmSaver from '@gitroom/helpers/utils/utm.saver';
import { DubAnalytics } from '@gitroom/frontend/components/layout/dubAnalytics';
import { FacebookComponent } from '@gitroom/frontend/components/layout/facebook.component';
import { HtmlComponent } from '@gitroom/frontend/components/layout/html.component';

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <VariableContextComponent
      storageProvider={process.env.STORAGE_PROVIDER! as 'local' | 'cloudflare'}
      environment={process.env.NODE_ENV!}
      backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
      plontoKey={process.env.NEXT_PUBLIC_POLOTNO!}
      stripeClient={process.env.STRIPE_PUBLISHABLE_KEY!}
      billingEnabled={!!process.env.STRIPE_PUBLISHABLE_KEY}
      heavyFeaturesEnabled={process.env.POSTIZ_ENABLE_HEAVY_FEATURES === 'true'}
      discordUrl={process.env.NEXT_PUBLIC_DISCORD_SUPPORT!}
      frontEndUrl={process.env.FRONTEND_URL!}
      isGeneral={!!process.env.IS_GENERAL}
      genericOauth={!!process.env.POSTIZ_GENERIC_OAUTH}
      oauthLogoUrl={process.env.NEXT_PUBLIC_POSTIZ_OAUTH_LOGO_URL!}
      oauthDisplayName={process.env.NEXT_PUBLIC_POSTIZ_OAUTH_DISPLAY_NAME!}
      uploadDirectory={process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY!}
      mcpUrl={process.env.MCP_URL}
      dub={!!process.env.STRIPE_PUBLISHABLE_KEY}
      facebookPixel={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL!}
      telegramBotName={process.env.TELEGRAM_BOT_NAME!}
      neynarClientId={process.env.NEYNAR_CLIENT_ID!}
      isSecured={!process.env.NOT_SECURED}
      disableImageCompression={!!process.env.DISABLE_IMAGE_COMPRESSION}
      disableXAnalytics={!!process.env.DISABLE_X_ANALYTICS}
      sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN!}
      extensionId={process.env.EXTENSION_ID || ''}
      language="en"
      transloadit={
        process.env.TRANSLOADIT_AUTH && process.env.TRANSLOADIT_TEMPLATE
          ? [process.env.TRANSLOADIT_AUTH!, process.env.TRANSLOADIT_TEMPLATE!]
          : []
      }
    >
      <SentryComponent>
        <HtmlComponent />
        <DubAnalytics />
        <FacebookComponent />
        {!!process.env.STRIPE_PUBLISHABLE_KEY ? (
          <PlausibleProvider
            domain={!!process.env.IS_GENERAL ? 'postiz.com' : 'gitroom.com'}
          >
            <PHProvider
              phkey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
              host={process.env.NEXT_PUBLIC_POSTHOG_HOST}
            >
              <LayoutContext>
                <UtmSaver />
                {children}
              </LayoutContext>
            </PHProvider>
          </PlausibleProvider>
        ) : (
          <PHProvider
            phkey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
            host={process.env.NEXT_PUBLIC_POSTHOG_HOST}
          >
            <LayoutContext>
              <UtmSaver />
              {children}
            </LayoutContext>
          </PHProvider>
        )}
      </SentryComponent>
    </VariableContextComponent>
  );
}
