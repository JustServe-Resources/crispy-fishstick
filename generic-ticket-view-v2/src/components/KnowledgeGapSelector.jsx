import React, { useEffect, useState } from 'react';
import { Combobox, Field, Label, Option } from '@zendeskgarden/react-dropdowns';
import styled from 'styled-components';

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

const KnowledgeGapSelector = ({ client, value, onChange, disabled }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!client) return;

    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const response = await client.request('/api/v2/custom_objects/knowledge_gap/records');
        setRecords(response.custom_object_records || []);
      } catch (err) {
        console.error('Failed to fetch Knowledge Gap records', err);
        setError('Failed to load options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [client]);

  if (isLoading) return <div>Loading options...</div>;
  if (error) return <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>;

  // Filter records based on user input
  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectedRecord = records.find(r => r.id === value) || null;

  const handleComboboxChange = ({ inputValue, selectionValue }) => {
    if (inputValue !== undefined) {
      setInputValue(inputValue);
    }

    if (selectionValue !== undefined) {
      // selectionValue is the record ID because option value={record.id}
      // If selectionValue is null (cleared), handle that too
      onChange(selectionValue);
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
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
          onChange={handleComboboxChange}
          isAutocomplete
          listboxAriaLabel="Knowledge Gap Options"
          disabled={disabled}
        >
          {filteredRecords.length === 0 ? (
            <Option isDisabled value="no-matches" label="No matches found">No matches found</Option>
          ) : (
            filteredRecords.map((record) => (
              <StyledOption key={record.id} value={record.id} label={record.name}>
                {record.name}
              </StyledOption>
            ))
          )}
        </Combobox>
      </Field>
    </div>
  );
};

export default KnowledgeGapSelector;
