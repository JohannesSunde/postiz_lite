'use client';

import useSWR from 'swr';
import { ContextWrapper } from '@gitroom/frontend/components/layout/user.context';
import { ReactNode, useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { Toaster } from '@gitroom/react/toaster/toaster';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import dynamic from 'next/dynamic';

const CopilotShell = dynamic(
  () => import('@gitroom/frontend/components/preview/copilot.shell').then((m) => m.PreviewCopilotShell),
  {
    ssr: false,
  }
);
export const PreviewWrapper = ({ children }: { children: ReactNode }) => {
  const fetch = useFetch();
  const { backendUrl, heavyFeaturesEnabled } = useVariables();
  const load = useCallback(async (path: string) => {
    return await (await fetch(path)).json();
  }, []);
  const { data: user } = useSWR('/user/self', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });
  return (
    <ContextWrapper user={user}>
      {heavyFeaturesEnabled ? (
        <CopilotShell backendUrl={backendUrl}>
          <MantineWrapper>
            <Toaster />
            {children}
          </MantineWrapper>
        </CopilotShell>
      ) : (
        <MantineWrapper>
          <Toaster />
          {children}
        </MantineWrapper>
      )}
    </ContextWrapper>
  );
};
