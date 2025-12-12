import { useRef, useState, useEffect } from 'react';
import { PaneProvider, Pane } from '@zendeskgarden/react-grid';
import useResizeObserver from 'use-resize-observer';
import { Field, Input, Textarea } from '@zendeskgarden/react-forms';
import { Accordion } from '@zendeskgarden/react-accordions';
import { Combobox, Option, Field as DropdownField, Menu, Item, ItemGroup } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Tag } from '@zendeskgarden/react-tags';
import { Notification } from '@zendeskgarden/react-notifications';
import MarkdownRenderer from './MarkdownRenderer';
import KnowledgeGapSelector from './KnowledgeGapSelector';
import TaskSelector from './TaskSelector';
import ProblemSelector from './ProblemSelector';
import { useTicketLogic } from '../hooks/useTicketLogic';
import { Container, NotesSection, MainPaneContent, SidebarPaneContent } from './TicketOverview.styles';
import { fetchCustomObjectRecord } from '../utils/zendesk';
import {
  INTERNAL_NOTES_FIELD_ID,
  KNOWLEDGE_GAP_FIELD_ID,
  TASK_FIELD_ID,
  PROBLEM_STEPS_FIELD_ID,
  PROBLEM_EXPECTED_FIELD_ID,
  PROBLEM_ACTUAL_FIELD_ID,
  TICKET_TYPES
} from '../utils/constants';

const QUICK_TASK_IDS = ['01K2YV3KRD5M9V29SV2QSC5MF7', '01K0SCJKA6B9YZTFPPZZYYH7NR', '01K1BX2H6J2ADM1GDB4XDAYY6P'];

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

  const { ref, width = 800, height = 600 } = useResizeObserver();
  const [quickTasks, setQuickTasks] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [notification, setNotification] = useState({ type: '', title: '', message: '', visible: false });

  useEffect(() => {
    if (!client) return;
    const loadQuickTasks = async () => {
      const promises = QUICK_TASK_IDS.map(id => fetchCustomObjectRecord(client, 'task', id).catch(e => {
        console.warn(`Failed to fetch quick task ${id}`, e);
        return null;
      }));
      const results = await Promise.all(promises);
      setQuickTasks(results.filter(r => r));
    };
    loadQuickTasks();
  }, [client]);

  const handleQuickMenuChange = (changes) => {
    if (changes.selectedItem) {
      const task = quickTasks.find(t => t.id === changes.selectedItem.value);
      if (task) {
        handleFieldChange('type', 'task');
        handleFieldChange(`custom_field_${TASK_FIELD_ID}`, task.id);

        if (task.custom_object_fields?.user_type) {
          handleFieldChange("custom_field_44259900026779", task.custom_object_fields.user_type);
        }
      }
    }
  };

  const internalNotes = ticket.custom_fields?.[INTERNAL_NOTES_FIELD_ID] || '';
  const currentType = pendingChanges.type !== undefined ? pendingChanges.type : (ticket.type || '');

  // Problem View (Full Width, Specialized)
  if (currentType === 'problem') {
    // ... (Keep existing problem view logic, maybe wrapping in a single pane if needed, but currently full width)
    const steps = ticket.custom_fields?.[PROBLEM_STEPS_FIELD_ID] || '';
    const expected = ticket.custom_fields?.[PROBLEM_EXPECTED_FIELD_ID] || '';
    const actual = ticket.custom_fields?.[PROBLEM_ACTUAL_FIELD_ID] || '';

    return (
      <Container>

        <NotesSection>
          <h3>Problem Details</h3>
          <div style={{ marginBottom: '20px' }}>
            <strong>Steps to Produce Behavior:</strong>
            <MarkdownRenderer content={steps} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Expected Behavior:</strong>
            <MarkdownRenderer content={expected} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Actual Behavior:</strong>
            <MarkdownRenderer content={actual} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '30px' }}>
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
        </NotesSection>
      </Container>
    );
  }

  // Standard View (Split Layout with Panes)
  return (
    <Container>
      {notification.visible && (
        <div style={{ marginBottom: '15px' }}>
          <Notification type={notification.type}>
            <Notification.Title>{notification.title}</Notification.Title>
            {notification.message}
            <Notification.Close onClick={() => setNotification({ ...notification, visible: false })} aria-label="Close Notification" />
          </Notification>
        </div>
      )}
      {isStale && (
        <div style={{ background: '#fff4e5', color: '#663c00', padding: '10px', marginBottom: '15px', border: '1px solid #ffcc00', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Update Detected:</strong> The ticket has been updated externally.</span>
          <Button size="small" onClick={refreshData}>Reload</Button>
        </div>
      )}


      <div ref={ref} style={{ flex: 1, minHeight: 0 }}>
        <PaneProvider
          totalPanesHeight={height}
          totalPanesWidth={width}
          defaultColumnValues={{
            'pane-1': 1,
            'pane-2': 1
          }}
        >
          {({ getGridTemplateColumns }) => (
            <div
              style={{
                width,
                height: '100%',
                display: 'grid',
                gridTemplateColumns: getGridTemplateColumns()
              }}
            >
              <Pane>
                <MainPaneContent>
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


                </MainPaneContent>
                <Pane.Splitter layoutKey="pane-1" min={0.5} max={1.5} aria-label="Resize pane" />
              </Pane>

              <Pane>
                <SidebarPaneContent>
                  <Field>
                    <Field.Label>Requester</Field.Label>
                    <Input value={ticket.requester?.name || ''} readOnly />
                    {ticket.requester?.id === 18885940524699 && ticket.email_cc_ids?.length === 1 && (
                      <Button
                        isBasic
                        size="small"
                        onClick={() => {
                          const newRequesterId = ticket.email_cc_ids[0];
                          client.request({
                            url: `/api/v2/tickets/${ticket.id}.json`,
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify({
                              ticket: {
                                requester_id: newRequesterId,
                                email_cc_ids: []
                              }
                            })
                          }).then(() => {
                            setNotification({
                              type: 'success',
                              title: 'Success',
                              message: 'Requester updated successfully!',
                              visible: true
                            });
                            refreshData();
                          }).catch(err => {
                            console.error('Failed to swap requester', err);
                            setNotification({
                              type: 'error',
                              title: 'Error',
                              message: 'Failed to update requester.',
                              visible: true
                            });
                          });
                        }}
                        style={{ marginTop: '8px', width: '100%' }}
                      >
                        Make CC the Requester
                      </Button>
                    )}
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

                  {currentType === 'incident' && (
                    <ProblemSelector
                      client={client}
                      value={pendingChanges.problem_id !== undefined
                        ? pendingChanges.problem_id
                        : (ticket.problem_id || '')
                      }
                      onChange={(val) => handleFieldChange('problem_id', val)}
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

                  <div className="mt-4">
                    <Accordion
                      level={4}
                      expandedSections={expandedSections}
                      onChange={(index) => {
                        if (expandedSections.includes(index)) {
                          setExpandedSections(expandedSections.filter((i) => i !== index));
                        } else {
                          setExpandedSections([...expandedSections, index]);
                        }
                      }}
                    >
                      <Accordion.Section>
                        <Accordion.Header>
                          <Accordion.Label>Common Tickets Quick Select</Accordion.Label>
                        </Accordion.Header>
                        <Accordion.Panel>
                          <Menu
                            button={(
                              <Button isBasic size="small" style={{ width: '100%' }}>
                                Select Common Issue
                              </Button>
                            )}
                            onChange={handleQuickMenuChange}
                          >
                            {quickTasks.length > 0 && (
                              <ItemGroup legend="Common Tasks">
                                {quickTasks.map(task => (
                                  <Item key={task.id} value={task.id}>
                                    {task.name}
                                    <Item.Meta>Task</Item.Meta>
                                  </Item>
                                ))}
                              </ItemGroup>
                            )}
                          </Menu>
                        </Accordion.Panel>
                      </Accordion.Section>
                    </Accordion>
                  </div>
                </SidebarPaneContent>
              </Pane>
            </div>
          )}
        </PaneProvider>
      </div>
    </Container>
  );
};

export default TicketOverview;
