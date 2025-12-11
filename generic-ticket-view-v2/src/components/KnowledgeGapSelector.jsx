import { Combobox, Field, Option, Hint } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Modal } from '@zendeskgarden/react-modals';
import { Field as FormField, Input, Textarea } from '@zendeskgarden/react-forms';
import { useKnowledgeGapLogic } from '../hooks/useKnowledgeGapLogic';
import { StyledOption, Container, GlobalStyle } from './KnowledgeGapSelector.styles';

const KnowledgeGapSelector = ({ client, value, onChange, onRecordSelect, disabled }) => {
  const {
    filteredRecords,
    selectedRecord,
    inputValue,
    setInputValue,
    isModalVisible,
    setIsModalVisible,
    selectedUserType,
    setSelectedUserType,
    sectionOptions,
    selectedSection,
    setSelectedSection,
    sectionInputValue,
    setSectionInputValue,
    newQuestion,
    setNewQuestion,
    newNotes,
    setNewNotes,
    isCreating,
    handleCreateRecord,
    userTypeOptions,
    debouncedHandleSearch
  } = useKnowledgeGapLogic(client, value, onChange, onRecordSelect);


  return (
    <Container>
      <style>{`
        [data-garden-id="dropdowns.combobox.listbox"] {
          min-width: 600px !important;
          width: 600px !important;
          max-width: none !important;
        }
      `}</style>

      <Field>
        <Field.Label>Knowledge Gap</Field.Label>
        <Combobox
          inputProps={{ placeholder: 'find question' }}

          selectedItem={selectedRecord}
          inputValue={inputValue}

          onChange={(changes) => {
            // Handle Input Change and Filtering
            if (changes.inputValue !== undefined) {
              setInputValue(changes.inputValue);
              debouncedHandleSearch(changes);
            }

            // Handle Selection
            if (changes.selectionValue !== undefined) {
              onChange(changes.selectionValue ? changes.selectionValue.id : null);
              if (onRecordSelect) {
                const sectionId = (changes.selectionValue.custom_object_fields && changes.selectionValue.custom_object_fields.custom_field_44256469941787)
                  ? changes.selectionValue.custom_object_fields.custom_field_44256469941787
                  : null;
                onRecordSelect(changes.selectionValue, null);
              }
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
          <Modal.Header tag="h2">Create New Knowledge Gap Question</Modal.Header>
          <Modal.Body>
            <FormField>
              <FormField.Label>Question (Name)</FormField.Label>
              <Input
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g. How do I reset my password?"
              />
            </FormField>

            {/* Use Dropdown Field for Combobox to ensure Context is provided */}
            <div style={{ marginTop: '16px' }}>
              <Field>
                <Field.Label>User Type Affected</Field.Label>
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
            {/* CATEGORY/SECTION DROPDOWN */}
            {sectionOptions.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Field>
                  <Field.Label>Category</Field.Label>
                  <Combobox
                    isAutocomplete
                    onChange={({ selectionValue }) => setSelectedSection(selectionValue)}
                    onInputValueChange={({ inputValue }) => setSectionInputValue(inputValue)}

                    selectedItem={selectedSection}
                    inputValue={sectionInputValue}
                    itemToString={(item) => {
                      if (!item) return '';
                      const found = sectionOptions.find(o => o.id === item);
                      return found ? found.name : item;
                    }}

                  >
                    {sectionOptions
                      .filter(s => s.name.toLowerCase().includes(sectionInputValue.toLowerCase()))
                      .map((opt) => (
                        <Option key={opt.id} value={opt.id} label={opt.name}>
                          {opt.name}
                        </Option>
                      ))}
                  </Combobox>
                </Field>
              </div>
            )}

            <FormField className="mt-4" style={{ marginTop: '16px' }}>
              <FormField.Label>Notes</FormField.Label>
              <Textarea
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
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
              <Button isPrimary onClick={handleCreateRecord} disabled={isCreating || !newQuestion}>
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

export default KnowledgeGapSelector;
