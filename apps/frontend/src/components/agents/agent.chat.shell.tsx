'use client';

import dynamic from 'next/dynamic';

const AgentChat = dynamic(
  () => import('@gitroom/frontend/components/agents/agent.chat').then((m) => m.AgentChat),
  {
    ssr: false,
    loading: () => <div className="flex-1 bg-newBgColorInner" />,
  }
);

export const AgentChatShell = () => {
  return <AgentChat />;
};
