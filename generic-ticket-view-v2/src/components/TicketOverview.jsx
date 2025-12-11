
import { Grid } from '@zendeskgarden/react-grid';
import { Field, Input, Textarea } from '@zendeskgarden/react-forms';
import { Combobox, Option, Field as DropdownField } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Tag } from '@zendeskgarden/react-tags';
import MarkdownRenderer from './MarkdownRenderer';
import KnowledgeGapSelector from './KnowledgeGapSelector';
import TaskSelector from './TaskSelector';
import { useTicketLogic } from '../hooks/useTicketLogic';
import { Container, Header, NotesSection, Sidebar } from './TicketOverview.styles';
import {
  INTERNAL_NOTES_FIELD_ID,
  KNOWLEDGE_GAP_FIELD_ID,
  TASK_FIELD_ID,
  TICKET_TYPES
} from '../utils/constants';

const TicketOverview = () => {
  const {
    client,
    ticket,
    ticketFields,
    pendingChanges,
    isStale,
    isEditingNotes,
    setIsEditingNotes,
    refreshData,
    handleFieldChange
  } = useTicketLogic();

  const internalNotes = ticket.custom_fields?.[INTERNAL_NOTES_FIELD_ID] || '';
  const currentType = pendingChanges.type !== undefined ? pendingChanges.type : (ticket.type || '');

  return (
    <Container>
      {isStale && (
        <div style={{ background: '#fff4e5', color: '#663c00', padding: '10px', marginBottom: '15px', border: '1px solid #ffcc00', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Update Detected:</strong> The ticket has been updated externally.</span>
          <Button size="small" onClick={refreshData}>Reload</Button>
        </div>
      )}
      <Header>
        <Input
          value={pendingChanges.subject !== undefined ? pendingChanges.subject : (ticket.subject || '')}
          onChange={e => handleFieldChange('subject', e.target.value)}
          isCompact
        />
      </Header>

      <Grid>
        <Grid.Row>
          <Grid.Col size={9}>
            <NotesSection>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Field.Label>Internal Notes</Field.Label>
                <Button size="small" isBasic onClick={() => setIsEditingNotes(!isEditingNotes)}>
                  {isEditingNotes ? 'Preview' : 'Edit'}
                </Button>
              </div>

              {isEditingNotes ? (
                <Textarea
                  minRows={5}
                  value={pendingChanges[`custom_field_${INTERNAL_NOTES_FIELD_ID}`] !== undefined ? pendingChanges[`custom_field_${INTERNAL_NOTES_FIELD_ID}`] : internalNotes}
                  onChange={e => handleFieldChange(`custom_field_${INTERNAL_NOTES_FIELD_ID}`, e.target.value)}
                />
              ) : (
                <MarkdownRenderer content={pendingChanges[`custom_field_${INTERNAL_NOTES_FIELD_ID}`] !== undefined ? pendingChanges[`custom_field_${INTERNAL_NOTES_FIELD_ID}`] : internalNotes} />
              )}

              {!internalNotes && !isEditingNotes && (
                <Button isLink onClick={() => setIsEditingNotes(true)}>Add Notes</Button>
              )}
            </NotesSection>

            <a href="#" onClick={(e) => { e.preventDefault(); /* Logic to open conversation */ }}>View Conversation</a>
          </Grid.Col>

          <Grid.Col size={3}>
            <Sidebar>
              <Field>
                <Field.Label>Requester</Field.Label>
                <Input value={ticket.requester?.name || ''} readOnly />
              </Field>
              <DropdownField className="mt-4">
                <DropdownField.Label>Type</DropdownField.Label>
                <Combobox
                  inputValue={TICKET_TYPES.find(t => t === currentType) ? currentType.charAt(0).toUpperCase() + currentType.slice(1) : ''}
                  inputProps={{ 'aria-label': 'Ticket Type' }}
                  onChange={({ selectionValue }) => {
                    if (selectionValue) {
                      handleFieldChange('type', selectionValue);
                    }
                  }}
                  isEditable={false}
                  selectedItem={currentType}
                >
                  {TICKET_TYPES.map(type => (
                    <Option
                      key={type}
                      value={type}
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                  ))}
                </Combobox>
              </DropdownField>

              {currentType === 'question' && (
                <KnowledgeGapSelector
                  client={client}
                  value={pendingChanges[`custom_field_${KNOWLEDGE_GAP_FIELD_ID}`] !== undefined
                    ? pendingChanges[`custom_field_${KNOWLEDGE_GAP_FIELD_ID}`]
                    : (ticket.custom_fields?.[KNOWLEDGE_GAP_FIELD_ID] || '')
                  }
                  onChange={(val) => handleFieldChange(`custom_field_${KNOWLEDGE_GAP_FIELD_ID}`, val)}
                  onRecordSelect={(record, sectionId) => {
                    console.log('onRecordSelect triggered', { record, sectionId });
                    if (record && record.custom_object_fields) {
                      const { user_type_affected: userTypeAffected } = record.custom_object_fields;
                      console.log('Syncing fields:', { userTypeAffected, sectionId });

                      // Map User Type (44259900026779)
                      if (userTypeAffected) {
                        handleFieldChange("custom_field_44259900026779", userTypeAffected);
                      }

                      // Map Section/Category (44256308727963)
                      if (sectionId) {
                        handleFieldChange("custom_field_44256308727963", sectionId);
                      }
                    }
                  }}
                  ticketFields={ticketFields}
                  disabled={isStale}
                />
              )}
              {currentType === 'task' && (
                <TaskSelector
                  client={client}
                  value={pendingChanges[`custom_field_${TASK_FIELD_ID}`] !== undefined
                    ? pendingChanges[`custom_field_${TASK_FIELD_ID}`]
                    : (ticket.custom_fields?.[TASK_FIELD_ID] || '')
                  }
                  onChange={(val) => handleFieldChange(`custom_field_${TASK_FIELD_ID}`, val)}
                  onRecordSelect={(record) => {
                    // Auto-fill logic for Task if needed
                    // Example: if task has user_type, sync it to ticket field
                    if (record && record.custom_object_fields) {
                      const { user_type: userType } = record.custom_object_fields;
                      if (userType) {
                        handleFieldChange("custom_field_44259900026779", userType);
                      }
                    }
                  }}
                  disabled={isStale}
                />
              )}

              <Field className="mt-4">
                <Field.Label>Assignee</Field.Label>
                <Input value={ticket.assignee?.user?.name || ''} readOnly />
              </Field>

              <div className="mt-4">
                <Field.Label>Tags</Field.Label>
                <div>
                  {ticket.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
              </div>
            </Sidebar>
          </Grid.Col>
        </Grid.Row>
      </Grid>


    </Container>
  );
};

export default TicketOverview;
