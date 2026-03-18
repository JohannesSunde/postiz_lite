'use client';

import { CopilotPopup } from '@copilotkit/react-ui';
import { FC } from 'react';

export const ManageCopilotPopup: FC<{
  title: string;
  initial: string;
}> = ({ title, initial }) => {
  return (
    <CopilotPopup
      hitEscapeToClose={false}
      clickOutsideToClose={true}
      instructions={`
You are an assistant that help the user to schedule their social media posts,
Here are the things you can do:
- Add a new comment / post to the list of posts
- Delete a comment / post from the list of posts
- Add content to the comment / post
- Activate or deactivate the comment / post

Post content can be added using the addPostContentFor{num} function.
After using the addPostFor{num} it will create a new addPostContentFor{num+ 1} function.
`}
      labels={{
        title,
        initial,
      }}
    />
  );
};
