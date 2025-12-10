import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Tag } from '@zendeskgarden/react-tags';
import { Combobox, Field, Label, Option, Hint } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Modal, Body, Header, Footer, FooterItem, Close } from '@zendeskgarden/react-modals';
import { Field as FormField, Label as FormLabel, Input, Textarea } from '@zendeskgarden/react-forms';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { fetchKnowledgeGapRecords, fetchCustomObjectField } from '../utils/zendesk';

const StyledOption = styled(Option)`
  && {
    white-space: normal;
    word-break: break-word;
    line-height: 1.4;
    height: auto;
    min-height: 32px;
    padding: 8px 4px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const CUSTOM_OBJECT_KEY = 'knowledge_gap';
const USER_TYPE_FIELD_KEY = 'kg_user_type';

const KnowledgeGapSelector = ({ client, value, onChange, onRecordSelect, disabled }) => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Multiselect State
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(null); // String (tag)
  const [userTypeInputValue, setUserTypeInputValue] = useState('');


  const loadRecords = async () => {
    if (!client) return;
    try {
      const recs = await fetchKnowledgeGapRecords(client);
      setRecords(recs);
    } catch (err) {
      console.error('Failed to fetch Knowledge Gap records', err);
      setError('Failed to load options');
    }
  };

  useEffect(() => {
    loadRecords();
  }, [client]);

  useEffect(() => {
    const loadOptions = async () => {
      if (!client) return;

      try {
        const fieldDef = await fetchCustomObjectField(client, CUSTOM_OBJECT_KEY, USER_TYPE_FIELD_KEY);
        if (fieldDef && fieldDef.custom_field_options) {
          setUserTypeOptions(fieldDef.custom_field_options);
        }
      } catch (err) {
        console.error("Failed to fetch User Type field options", err);
      }
    };

    loadOptions();
  }, [client]);

  // Filter User Type options locally for the multiselect
  const [filteredUserTypeOptions, setFilteredUserTypeOptions] = useState(userTypeOptions);

  useEffect(() => {
    setFilteredUserTypeOptions(userTypeOptions);
  }, [userTypeOptions]);

  const handleUserTypeInputChange = useCallback(debounce(({ inputValue }) => {
    if (inputValue !== undefined) {
      setUserTypeInputValue(inputValue);
      const regex = new RegExp(inputValue.replace(/[.*+?^${}()|[\]\\]/giu, '\\$&'), 'giu');
      // Filter by label (name)
      setFilteredUserTypeOptions(userTypeOptions.filter(opt => opt.name.match(regex)));
    }
  }, 300), [userTypeOptions]);

  const handleCreateRecord = async () => {
    if (!newQuestion) return;
    setIsCreating(true);

    const match = records.find(r => r.name.toLowerCase() === newQuestion.toLowerCase());
    if (match) {
      alert('Record already exists!');
      setIsCreating(false);
      return;
    }

    // Payload: selectedUserType is a single string
    const userTypePayload = selectedUserType;

    const payload = {
      custom_object_record: {
        name: newQuestion,
        custom_object_fields: {
          [USER_TYPE_FIELD_KEY]: userTypePayload,
          knowledge_gap_notes: newNotes
        }
      }
    };

    try {
      const response = await client.request({
        url: '/api/v2/custom_objects/knowledge_gap/records',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload)
      });

      const newRecord = response.custom_object_record;
      await loadRecords();
      onChange(newRecord.id);
      if (onRecordSelect) onRecordSelect(newRecord);

      setIsModalVisible(false);
      setNewQuestion('');
      setSelectedUserType(null);
      setNewNotes('');

      client.invoke('notify', 'Knowledge Gap record created!', 'success');
    } catch (err) {
      console.error('Failed to create record', err);
      client.invoke('notify', 'Failed to create record.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectedRecord = records.find(r => r.id === value) || null;

  return (
    <div style={{ marginBottom: '16px', marginTop: '4px' }}>
      <style>{`
        [data-garden-id="dropdowns.combobox.listbox"] {
          min-width: 600px !important;
          width: 600px !important;
          max-width: none !important;
        }
      `}</style>

      <Field>
        <Label>Knowledge Gap</Label>
        <Combobox
          inputProps={{ placeholder: 'find question' }}
          selectedItem={selectedRecord}
          itemToString={(item) => item ? item.name : ''}
          onChange={({ inputValue, selectionValue }) => {
            if (inputValue !== undefined) setInputValue(inputValue);
            if (selectionValue !== undefined) {
              onChange(selectionValue ? selectionValue.id : null);
              if (onRecordSelect) onRecordSelect(selectionValue);
            }
          }}
          isAutocomplete
          listboxAriaLabel="Knowledge Gap Options"
          disabled={disabled}
        >
          {filteredRecords.length === 0 ? (
            <Option isDisabled value="no-matches" label="No matches found">No matches found</Option>
          ) : (
            filteredRecords.map((record) => (
              <StyledOption key={record.id} value={record} label={record.name}>
                {record.name}
              </StyledOption>
            ))
          )}
        </Combobox>
      </Field>

      {/* Button Moved Below Selector */}
      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <Button size="small" isLink onClick={() => setIsModalVisible(true)}>
          + Create new Question
        </Button>
      </div>

      {/* CREATE MODAL */}
      {isModalVisible && (
        <Modal isLarge onClose={() => setIsModalVisible(false)}>
          <Header tag="h2">Create New Knowledge Gap Question</Header>
          <Body>
            <FormField>
              <FormLabel>Question (Name)</FormLabel>
              <Input
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g. How do I reset my password?"
              />
            </FormField>

            {/* Use Dropdown Field for Combobox to ensure Context is provided */}
            <div style={{ marginTop: '16px' }}>
              <Field>
                <Label>User Type Affected</Label>
                <Hint>Select all that apply</Hint>
                <Combobox
                  isAutocomplete
                  onChange={({ selectionValue, inputValue }) => {
                    if (inputValue !== undefined) {
                      handleUserTypeInputChange({ inputValue });
                    }
                    if (selectionValue) {
                      setSelectedUserType(selectionValue);
                    }
                  }}
                  selectedItem={selectedUserType}
                  itemToString={(item) => {
                    if (!item) return '';
                    const found = userTypeOptions.find(o => o.value === item);
                    return found ? found.name : item;
                  }}
                >
                  {filteredUserTypeOptions.map((opt, index) => (
                    <Option
                      key={index}
                      value={opt.value}
                      label={opt.name}
                      isSelected={selectedUserType === opt.value}
                    >
                      {opt.name}
                    </Option>
                  ))}
                </Combobox>
              </Field>
            </div>

            <FormField className="mt-4" style={{ marginTop: '16px' }}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                minRows={3}
              />
            </FormField>
          </Body>
          <Footer>
            <FooterItem>
              <Button onClick={() => setIsModalVisible(false)} isBasic disabled={isCreating}>
                Cancel
              </Button>
            </FooterItem>
            <FooterItem>
              <Button isPrimary onClick={handleCreateRecord} disabled={isCreating || !newQuestion}>
                {isCreating ? 'Creating...' : 'Create Record'}
              </Button>
            </FooterItem>
          </Footer>
          <Close aria-label="Close modal" />
        </Modal>
      )}
    </div>
  );
};

export default KnowledgeGapSelector;
