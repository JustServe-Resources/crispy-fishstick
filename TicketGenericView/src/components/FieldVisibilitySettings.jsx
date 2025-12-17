import React from 'react';
import { Checkbox, Field, Label } from '@zendeskgarden/react-forms';
import { SettingsContainer, SettingsGrid } from '../styles/SettingsStyles';

export const FieldVisibilitySettings = ({ visibleFields, toggleFieldVisibility }) => {
  const fieldOptions = [
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'type', label: 'Type' },
    { key: 'requester', label: 'Requester' },
    { key: 'assignee', label: 'Assignee' },
    { key: 'tags', label: 'Tags' },
    { key: 'description', label: 'Ticket Description' }
  ];

  return (
    <SettingsContainer>
      <h4>Visible Fields</h4>
      <SettingsGrid>
        {fieldOptions.map(option => (
          <Field key={option.key}>
            <Checkbox
              checked={visibleFields[option.key]}
              onChange={() => toggleFieldVisibility(option.key)}
            >
              <Label>{option.label}</Label>
            </Checkbox>
          </Field>
        ))}
      </SettingsGrid>
    </SettingsContainer>
  );
};
