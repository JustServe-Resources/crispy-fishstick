import { Combobox, Field, Option } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Modal } from '@zendeskgarden/react-modals';
import { Field as FormField, Input, Textarea } from '@zendeskgarden/react-forms';
import { useTaskLogic } from '../hooks/useTaskLogic';
import { StyledOption, Container, GlobalStyle } from './KnowledgeGapSelector.styles'; // Reusing styles

const TaskSelector = ({ client, value, onChange, onRecordSelect, disabled }) => {
  const {
    filteredRecords,
    selectedRecord,
    inputValue,
    setInputValue,
    isModalVisible,
    setIsModalVisible,
    newTaskName,
    setNewTaskName,
    newSummary,
    setNewSummary,
    userTypeOptions,
    selectedUserType,
    setSelectedUserType,
    isCreating,
    handleCreateRecord,
    debouncedHandleSearch
  } = useTaskLogic(client, value, onChange, onRecordSelect);


  return (
    <Container>
      <GlobalStyle />
      <Field>
        <Field.Label>Task</Field.Label>
        <Combobox
          inputProps={{ placeholder: 'find task' }}

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
          listboxAriaLabel="Task Options"
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

      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <Button size="small" isLink onClick={() => setIsModalVisible(true)}>
          + Create new Task
        </Button>
      </div>

      {isModalVisible && (
        <Modal isLarge onClose={() => setIsModalVisible(false)}>
          <Modal.Header tag="h2">Create New Task</Modal.Header>
          <Modal.Body>
            <FormField>
              <FormField.Label>Task Name</FormField.Label>
              <Input
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                placeholder="e.g. Reset Password"
              />
            </FormField>

            <div style={{ marginTop: '16px' }}>
              <Field>
                <Field.Label>User Type</Field.Label>
                <Combobox
                  isEditable={false}
                  onChange={({ selectionValue }) => setSelectedUserType(selectionValue)}
                  selectedItem={selectedUserType}
                >
                  {userTypeOptions.map((opt, index) => (
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
              <FormField.Label>Summary</FormField.Label>
              <Textarea
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                minRows={3}
              />
            </FormField>
          </Modal.Body>
          <Modal.Footer>
            <Modal.FooterItem>
              <Button onClick={() => setIsModalVisible(false)} isBasic disabled={isCreating}>
                Cancel
              </Button>
            </Modal.FooterItem>
            <Modal.FooterItem>
              <Button isPrimary onClick={handleCreateRecord} disabled={isCreating || !newTaskName}>
                {isCreating ? 'Creating...' : 'Create Record'}
              </Button>
            </Modal.FooterItem>
          </Modal.Footer>
          <Modal.Close aria-label="Close modal" />
        </Modal>
      )}
    </Container>
  );
};

export default TaskSelector;
