'use client';

import { CopilotKit } from '@copilotkit/react-core';
import { ReactNode } from 'react';

export const PreviewCopilotShell = ({
  backendUrl,
  children,
}: {
  backendUrl: string;
  children: ReactNode;
}) => {
  return (
    <CopilotKit
      credentials="include"
      runtimeUrl={backendUrl + '/copilot/chat'}
      showDevConsole={false}
    >
      {children}
    </CopilotKit>
  );
};
