'use client';

import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { FC } from 'react';

export const EditorCopilotBindings: FC<{
  items: Array<{ content: string }>;
  setValue: (value: string[]) => void;
}> = ({ items, setValue }) => {
  useCopilotReadable({
    description: 'Current content of posts',
    value: items.map((p) => p.content),
  });

  useCopilotAction({
    name: 'setPosts',
    description: 'a thread of posts',
    parameters: [
      {
        name: 'content',
        type: 'string[]',
        description: 'a thread of posts',
      },
    ],
    handler: async ({ content }) => {
      setValue(content);
    },
  });

  return null;
};
