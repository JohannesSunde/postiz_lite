'use client';

import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { FC, useCallback } from 'react';
import { Integrations } from '@gitroom/frontend/components/launches/calendar.context';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useStateCallback } from '@gitroom/react/helpers/use.state.callback';
import { timer } from '@gitroom/helpers/utils/timer';

export const CopilotPlatformBindings: FC<{
  isMain: boolean;
  integrations: Integrations[];
  selectedIntegrations: Integrations[];
  onChange: (integrations: Integrations[], callback: () => void) => void;
  singleSelect: boolean;
}> = ({ isMain, integrations, selectedIntegrations, onChange, singleSelect }) => {
  const [selectedAccounts, setSelectedAccounts] = useStateCallback<Integrations[]>(
    selectedIntegrations.slice(0).map((p) => ({
      ...p,
    }))
  );

  const addPlatform = useCallback(
    (integration: Integrations) => async () => {
      const promises = [];
      if (singleSelect) {
        promises.push(
          new Promise((res) => {
            onChange([integration], () => {
              res('');
            });
          })
        );
        promises.push(
          new Promise((res) => {
            setSelectedAccounts([integration], () => {
              res('');
            });
          })
        );
        return;
      }
      if (selectedAccounts.some((account) => account.id === integration.id)) {
        const changedIntegrations = selectedAccounts.filter(
          ({ id }) => id !== integration.id
        );
        if (
          !singleSelect &&
          !(await deleteDialog('Are you sure you want to remove this platform?'))
        ) {
          return;
        }
        promises.push(
          new Promise((res) => {
            onChange(changedIntegrations, () => {
              res('');
            });
          })
        );
        promises.push(
          new Promise((res) => {
            setSelectedAccounts(changedIntegrations, () => {
              res('');
            });
          })
        );
      } else {
        const changedIntegrations = [...selectedAccounts, integration];
        promises.push(
          new Promise((res) => {
            onChange(changedIntegrations, () => {
              res('');
            });
          })
        );
        promises.push(
          new Promise((res) => {
            setSelectedAccounts(changedIntegrations, () => {
              res('');
            });
          })
        );
      }
      await timer(500);
      await Promise.all(promises);
    },
    [onChange, singleSelect, selectedAccounts, setSelectedAccounts]
  );

  const handler = async ({ integrationsId }: { integrationsId: string[] }) => {
    const selected = selectedIntegrations.map((p) => p.id);
    const notToRemove = selected.filter((p) => integrationsId.includes(p));
    const toAdd = integrationsId.filter((p) => !selected.includes(p));
    const newIntegrations = [...notToRemove, ...toAdd]
      .map((id) => integrations.find((p) => p.id === id)!)
      .filter((p) => p);
    setSelectedAccounts(newIntegrations, () => {
      console.log('changed');
    });
    onChange(newIntegrations, () => {
      console.log('changed');
    });
  };

  useCopilotReadable({
    description: isMain
      ? 'All available platforms channels'
      : 'Possible platforms channels to edit',
    value: JSON.stringify(integrations),
  });
  useCopilotAction(
    {
      name: isMain ? `addOrRemovePlatform` : 'setSelectedIntegration',
      description: isMain
        ? `Add or remove channels to schedule your post to, pass all the ids as array`
        : 'Set selected integrations',
      parameters: [
        {
          name: 'integrationsId',
          type: 'string[]',
          description: 'List of integrations id to set as selected',
          required: true,
        },
      ],
      handler,
    },
    [
      addPlatform,
      selectedAccounts,
      integrations,
      onChange,
      singleSelect,
      setSelectedAccounts,
    ]
  );

  return null;
};
