import { useState } from 'react';
import { Combobox, Field, Option } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Modal } from '@zendeskgarden/react-modals';
import { Field as FormField, Input, Textarea, FileUpload, FileList, File as FileItem } from '@zendeskgarden/react-forms';
import { Tooltip } from '@zendeskgarden/react-tooltips';
import { useProblemLogic } from '../hooks/useProblemLogic';
import { StyledOption, Container, GlobalStyle } from './KnowledgeGapSelector.styles';
import MarkdownRenderer from './MarkdownRenderer';

const MarkdownField = ({ label, value, onChange, placeholder, minRows = 3 }) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <FormField className="mt-4" style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <FormField.Label>{label}</FormField.Label>
        <Button size="small" isBasic onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {isPreview ? (
        <div style={{ padding: '8px', border: '1px solid #d8dcde', borderRadius: '4px', minHeight: '80px', backgroundColor: '#fafafa' }}>
          <MarkdownRenderer content={value || '_No content_'} />
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          minRows={minRows}
          placeholder={placeholder}
        />
      )}
    </FormField>
  );
};


const ProblemSelector = ({ client, value, onChange, onRecordSelect, disabled }) => {
  const {
    filteredRecords,
    selectedRecord,
    inputValue,
    setInputValue,
    isModalVisible,
    setIsModalVisible,
    newSubject,
    setNewSubject,
    newSteps,
    setNewSteps,
    newExpected,
    setNewExpected,
    newActual,
    setNewActual,
    newInternalNotes,
    setNewInternalNotes,
    newAttachments,
    setNewAttachments,
    isCreating,
    handleCreateRecord,
    debouncedHandleSearch
  } = useProblemLogic(client, value, onChange, onRecordSelect);


  const handleFileChange = (e) => {
    if (e.target.files) {
      // Append new files to existing ones
      setNewAttachments(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (indexToRemove) => {
    setNewAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  return (
    <Container>
      <GlobalStyle />
      <Field>
        <Field.Label>Complaint / Problem</Field.Label>
        <Combobox
          inputProps={{ placeholder: 'find problem' }}
          selectedItem={selectedRecord}
          inputValue={inputValue}
          onChange={(changes) => {
            if (changes.inputValue !== undefined) {
              setInputValue(changes.inputValue);
              debouncedHandleSearch(changes);
            }
            if (changes.selectionValue !== undefined) {
              onChange(changes.selectionValue ? changes.selectionValue.id : null);
              if (onRecordSelect) {
                onRecordSelect(changes.selectionValue);
              }
            }
          }}
          isAutocomplete
          listboxAriaLabel="Problem Options"
          disabled={disabled}
        >
          {filteredRecords.length === 0 ? (
            <Option isDisabled value="no-matches" label="No matches found">No matches found</Option>
          ) : (
            filteredRecords.map((record) => (
              <StyledOption key={record.id} value={record} label={record.subject}>
                <span style={{ fontWeight: 'bold' }}>#{record.id}</span> - {record.subject}
              </StyledOption>
            ))
          )}
        </Combobox>
      </Field>

      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <Button size="small" isLink onClick={() => setIsModalVisible(true)}>
          + Create new Problem
        </Button>
      </div>

      {isModalVisible && (
        <Modal isLarge onClose={() => setIsModalVisible(false)}>
          <Modal.Header tag="h2">Create New Problem</Modal.Header>
          <Modal.Body>
            <FormField>
              <FormField.Label>Subject</FormField.Label>
              <Input
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                placeholder="e.g. Login page error 500"
              />
            </FormField>

            <MarkdownField
              label="Steps to Produce Behavior"
              value={newSteps}
              onChange={setNewSteps}
              placeholder="1. Go to login page..."
            />

            <MarkdownField
              label="Expected Behavior"
              value={newExpected}
              onChange={setNewExpected}
              placeholder="User should be logged in."
              minRows={2}
            />

            <MarkdownField
              label="Actual Behavior"
              value={newActual}
              onChange={setNewActual}
              placeholder="Error 500 appears."
              minRows={2}
            />

            <MarkdownField
              label="Internal Notes"
              value={newInternalNotes}
              onChange={setNewInternalNotes}
              placeholder="Private notes for the team..."
              minRows={2}
            />

            <FormField className="mt-4" style={{ marginTop: '16px' }}>
              <FormField.Label>Attachments</FormField.Label>
              <FileUpload>
                <Input type="file" multiple onChange={handleFileChange} />
                <span>Drag and drop files or click to upload</span>
              </FileUpload>

              {newAttachments.length > 0 && (
                <FileList style={{ marginTop: '8px' }}>
                  {newAttachments.map((file, index) => (
                    <FileList.Item key={`${file.name}-${index}`}>
                      <FileItem type='generic' aria-label={file.name}>
                        {file.name}
                        <Tooltip content="Remove file">
                          <FileItem.Close
                            aria-label="Remove file"
                            onClick={() => removeAttachment(index)}
                          />
                        </Tooltip>
                      </FileItem>
                    </FileList.Item>
                  ))}
                </FileList>
              )}
            </FormField>

          </Modal.Body>
          <Modal.Footer>
            <Modal.FooterItem>
              <Button onClick={() => setIsModalVisible(false)} isBasic disabled={isCreating}>
                Cancel
              </Button>
            </Modal.FooterItem>
            <Modal.FooterItem>
              <Button isPrimary onClick={handleCreateRecord} disabled={isCreating || !newSubject || !newSteps}>
                {isCreating ? 'Creating...' : 'Create Problem'}
              </Button>
            </Modal.FooterItem>
          </Modal.Footer>
          <Modal.Close aria-label="Close modal" />
        </Modal>
      )}
    </Container>
  );
};

export default ProblemSelector;
