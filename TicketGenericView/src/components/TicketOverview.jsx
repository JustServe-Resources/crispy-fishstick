import React, { useState, useEffect } from 'react';
import { Accordion } from '@zendeskgarden/react-accordions';
import { Button } from '@zendeskgarden/react-buttons';
import { Field, Label, Input, Textarea } from '@zendeskgarden/react-forms';
import { Combobox, Field as DropdownField, Label as DropdownLabel, Option } from '@zendeskgarden/react-dropdowns';
import { Tag } from '@zendeskgarden/react-tags';
import { MarkdownRenderer } from './MarkdownRenderer';
import { FieldVisibilitySettings } from './FieldVisibilitySettings';
import {
  OverviewContainer,
  HeaderRow,
  SectionHeader,
  SubjectHeader,
  SubjectEditContainer,
  FieldRow,
  EditableFieldRow,
  FieldLabel,
  FieldValue,
  TagContainer,
  LoadingContainer,
  DescriptionSection,
  GridContainer,
  CommentHistoryColumn,
  SidebarColumn,
  SidebarFieldRow,
  InlineEditContainer,
  SaveButtonContainer,
  NotesEditButton,
  NotesContentWrapper,
  ConversationLink,
  InternalNotesSection
} from '../styles/TicketOverviewStyles';

export const TicketOverview = ({ ticketData, ticketFields, loading, onRefresh }) => {
  const [ticket, setTicket] = useState(null);
  const [fields, setFields] = useState([]);
  const [internalNotes, setInternalNotes] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    subject: true,
    status: true,
    priority: true,
    type: true,
    requester: true,
    assignee: true,
    tags: true,
    description: true
  });

  const [editingSubject, setEditingSubject] = useState(false);
  const [editSubjectValue, setEditSubjectValue] = useState('');
  
  const [editingRequester, setEditingRequester] = useState(false);
  const [editRequesterValue, setEditRequesterValue] = useState('');
  
  const [editingType, setEditingType] = useState(false);
  const [editTypeValue, setEditTypeValue] = useState('');
  
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [editAssigneeValue, setEditAssigneeValue] = useState('');
  
  const [editingNotes, setEditingNotes] = useState(false);
  const [editNotesValue, setEditNotesValue] = useState('');

  const [pendingChanges, setPendingChanges] = useState({});

  const [taskRecords, setTaskRecords] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ticketData) {
      const ticketObj = {
        id: ticketData['ticket.id'],
        subject: ticketData['ticket.subject'],
        status: ticketData['ticket.status'],
        priority: ticketData['ticket.priority'],
        type: ticketData['ticket.type'],
        tags: ticketData['ticket.tags'],
        requester: ticketData['ticket.requester'],
        assignee: ticketData['ticket.assignee'],
        description: ticketData['ticket.description']
      };
      
      console.log('Setting ticket data, type:', ticketObj.type);
      setTicket(ticketObj);
      setFields(ticketFields);
      setInternalNotes(ticketData['ticket.customField:custom_field_37453127421979'] || '');
      
      const currentTaskValue = ticketData['ticket.customField:custom_field_38720689571483'];
      if (currentTaskValue) {
        setSelectedTask(currentTaskValue);
      }
    }
    loadFieldVisibility();
  }, [ticketData, ticketFields]);

  useEffect(() => {
    const currentType = pendingChanges.type || ticket?.type;
    if (currentType === 'task') {
      fetchTaskRecords();
      switchToTaskForm();
    }
  }, [pendingChanges.type, ticket?.type]);

  const fetchTaskRecords = async () => {
    setLoadingTasks(true);
    try {
      const response = await window.zafClient.request({
        url: '/api/v2/custom_objects/task/records',
        type: 'GET'
      });
      
      if (response && response.custom_object_records) {
        setTaskRecords(response.custom_object_records);
      }
    } catch (error) {
      console.error('Error fetching task records:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const switchToTaskForm = async () => {
    try {
      await window.zafClient.invoke('ticketFields:ticket_form_id.setValue', 40371906157979);
    } catch (error) {
      console.error('Error switching form:', error);
    }
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTask(taskId);
    handleApplyChange('taskLookup', taskId);
  };

  const loadFieldVisibility = () => {
    const saved = localStorage.getItem('ticketFieldVisibility');
    if (saved) {
      setFieldVisibility(JSON.parse(saved));
    }
  };

  const saveFieldVisibility = (newVisibility) => {
    setFieldVisibility(newVisibility);
    localStorage.setItem('ticketFieldVisibility', JSON.stringify(newVisibility));
  };

  const handleApplyChange = (field, value) => {
    console.log('Applying change:', field, value);
    setPendingChanges(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('Updated pending changes:', updated);
      return updated;
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      console.log('Saving pending changes:', pendingChanges);
      
      for (const [field, value] of Object.entries(pendingChanges)) {
        console.log(`Saving ${field}:`, value);
        if (field === 'subject') {
          await window.zafClient.set('ticket.subject', value);
        } else if (field === 'type') {
          await window.zafClient.set('ticket.type', value);
        } else if (field === 'requester') {
          await window.zafClient.set('ticket.requester', value);
        } else if (field === 'assignee') {
          await window.zafClient.set('ticket.assignee', value);
        } else if (field === 'internalNotes') {
          await window.zafClient.set('ticket.customField:custom_field_37453127421979', value);
        } else if (field === 'taskLookup') {
          await window.zafClient.set('ticket.customField:custom_field_38720689571483', value);
        }
      }
      
      console.log('All changes saved, clearing pending changes');
      setPendingChanges({});
      
      // Wait a bit for Zendesk to process the changes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger a refresh from the parent component
      if (onRefresh) {
        await onRefresh();
      } else {
        // Fallback to page reload if no refresh function provided
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes: ' + JSON.stringify(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setPendingChanges({});
    setEditingSubject(false);
    setEditingRequester(false);
    setEditingType(false);
    setEditingAssignee(false);
    setEditingNotes(false);
  };

  const handleOpenConversation = async () => {
    try {
      await window.zafClient.invoke('routeTo', 'ticket', ticket.id);
    } catch (error) {
      console.error('Error opening conversation:', error);
    }
  };

  if (loading || saving) {
    return <LoadingContainer>{saving ? 'Saving changes...' : 'Loading ticket data...'}</LoadingContainer>;
  }

  if (!ticket) {
    return <LoadingContainer>No ticket data available</LoadingContainer>;
  }

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const hasNotes = internalNotes || pendingChanges.internalNotes;
  const isTaskType = (pendingChanges.type || ticket.type) === 'task';
  const displayType = pendingChanges.type || ticket.type || 'N/A';

  console.log('Render - Current display type:', displayType, 'Pending:', pendingChanges.type, 'Ticket:', ticket.type);

  return (
    <OverviewContainer>
      {hasPendingChanges && (
        <SaveButtonContainer>
          <Button isPrimary onClick={handleSaveAll} disabled={saving}>
            Save All Changes
          </Button>
          <Button onClick={handleDiscardChanges} disabled={saving}>
            Discard Changes
          </Button>
          <span style={{ fontSize: '14px', color: '#68737d' }}>
            You have unsaved changes
          </span>
        </SaveButtonContainer>
      )}

      <SubjectEditContainer>
        {!editingSubject ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SubjectHeader style={{ fontStyle: pendingChanges.subject ? 'italic' : 'normal' }}>
              {pendingChanges.subject || ticket.subject}
            </SubjectHeader>
            <Button
              size="small"
              onClick={() => {
                setEditSubjectValue(pendingChanges.subject || ticket.subject);
                setEditingSubject(true);
              }}
            >
              Edit
            </Button>
          </div>
        ) : (
          <InlineEditContainer>
            <Field>
              <Label>Subject</Label>
              <Input
                value={editSubjectValue}
                onChange={(e) => setEditSubjectValue(e.target.value)}
              />
            </Field>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <Button
                size="small"
                isPrimary
                onClick={() => {
                  handleApplyChange('subject', editSubjectValue);
                  setEditingSubject(false);
                }}
              >
                Apply
              </Button>
              <Button
                size="small"
                onClick={() => setEditingSubject(false)}
              >
                Cancel
              </Button>
            </div>
          </InlineEditContainer>
        )}
      </SubjectEditContainer>

      <GridContainer>
        <CommentHistoryColumn>
          <InternalNotesSection>
            <SectionHeader style={{ marginBottom: '12px' }}>Internal Notes</SectionHeader>
            {!hasNotes && !editingNotes ? (
              <Button
                size="small"
                onClick={() => {
                  setEditNotesValue('');
                  setEditingNotes(true);
                }}
              >
                Add Notes
              </Button>
            ) : (
              <>
                {!editingNotes ? (
                  <NotesContentWrapper>
                    <div style={{ fontStyle: pendingChanges.internalNotes ? 'italic' : 'normal' }}>
                      <MarkdownRenderer content={pendingChanges.internalNotes || internalNotes} />
                    </div>
                    <NotesEditButton
                      size="small"
                      onClick={() => {
                        setEditNotesValue(pendingChanges.internalNotes || internalNotes);
                        setEditingNotes(true);
                      }}
                    >
                      Edit
                    </NotesEditButton>
                  </NotesContentWrapper>
                ) : (
                  <InlineEditContainer>
                    <Field>
                      <Label>Internal Notes (Markdown supported)</Label>
                      <Textarea
                        value={editNotesValue}
                        onChange={(e) => setEditNotesValue(e.target.value)}
                        rows={10}
                      />
                    </Field>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <Button
                        size="small"
                        isPrimary
                        onClick={() => {
                          handleApplyChange('internalNotes', editNotesValue);
                          setEditingNotes(false);
                        }}
                      >
                        Apply
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setEditingNotes(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </InlineEditContainer>
                )}
              </>
            )}
          </InternalNotesSection>

          <ConversationLink onClick={handleOpenConversation}>
            View Conversation →
          </ConversationLink>
        </CommentHistoryColumn>

        <SidebarColumn>
          {fieldVisibility.requester && (
            <SidebarFieldRow>
              {!editingRequester ? (
                <>
                  <FieldLabel>Requester</FieldLabel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FieldValue style={{ fontStyle: pendingChanges.requester ? 'italic' : 'normal' }}>
                      {pendingChanges.requester || ticket.requester?.name || 'N/A'}
                    </FieldValue>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditRequesterValue(pendingChanges.requester || ticket.requester?.name || '');
                        setEditingRequester(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </>
              ) : (
                <InlineEditContainer>
                  <Field>
                    <Label>Requester</Label>
                    <Input
                      value={editRequesterValue}
                      onChange={(e) => setEditRequesterValue(e.target.value)}
                    />
                  </Field>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <Button
                      size="small"
                      isPrimary
                      onClick={() => {
                        handleApplyChange('requester', editRequesterValue);
                        setEditingRequester(false);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setEditingRequester(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </InlineEditContainer>
              )}
            </SidebarFieldRow>
          )}

          {fieldVisibility.type && (
            <SidebarFieldRow>
              {!editingType ? (
                <>
                  <FieldLabel>Type</FieldLabel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FieldValue style={{ fontStyle: pendingChanges.type ? 'italic' : 'normal' }}>
                      {displayType}
                    </FieldValue>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditTypeValue(displayType);
                        setEditingType(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </>
              ) : (
                <InlineEditContainer>
                  <DropdownField>
                    <DropdownLabel>Type</DropdownLabel>
                    <Combobox
                      selectionValue={editTypeValue}
                      onSelect={(value) => {
                        if (typeof value === 'string') {
                          setEditTypeValue(value);
                        }
                      }}
                      isEditable={false}
                    >
                      <Option value="question">Question</Option>
                      <Option value="incident">Incident</Option>
                      <Option value="problem">Problem</Option>
                      <Option value="task">Task</Option>
                    </Combobox>
                  </DropdownField>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <Button
                      size="small"
                      isPrimary
                      onClick={() => {
                        handleApplyChange('type', editTypeValue);
                        setEditingType(false);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setEditingType(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </InlineEditContainer>
              )}
            </SidebarFieldRow>
          )}

          {isTaskType && (
            <SidebarFieldRow>
              <FieldLabel>Select Task</FieldLabel>
              {loadingTasks ? (
                <div style={{ fontSize: '14px', color: '#68737d' }}>Loading tasks...</div>
              ) : (
                <DropdownField>
                  <Combobox
                    selectionValue={selectedTask}
                    onSelect={(value) => {
                      if (typeof value === 'string') {
                        handleTaskSelection(value);
                      }
                    }}
                    isEditable={false}
                  >
                    {taskRecords.map((task) => (
                      <Option key={task.id} value={task.id}>
                        {task.name}
                      </Option>
                    ))}
                  </Combobox>
                </DropdownField>
              )}
            </SidebarFieldRow>
          )}

          {fieldVisibility.assignee && (
            <SidebarFieldRow>
              {!editingAssignee ? (
                <>
                  <FieldLabel>Assignee</FieldLabel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FieldValue style={{ fontStyle: pendingChanges.assignee ? 'italic' : 'normal' }}>
                      {pendingChanges.assignee || ticket.assignee?.user?.name || 'Unassigned'}
                    </FieldValue>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditAssigneeValue(pendingChanges.assignee || ticket.assignee?.user?.name || '');
                        setEditingAssignee(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </>
              ) : (
                <InlineEditContainer>
                  <Field>
                    <Label>Assignee</Label>
                    <Input
                      value={editAssigneeValue}
                      onChange={(e) => setEditAssigneeValue(e.target.value)}
                    />
                  </Field>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <Button
                      size="small"
                      isPrimary
                      onClick={() => {
                        handleApplyChange('assignee', editAssigneeValue);
                        setEditingAssignee(false);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setEditingAssignee(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </InlineEditContainer>
              )}
            </SidebarFieldRow>
          )}

          {fieldVisibility.tags && ticket.tags && ticket.tags.length > 0 && (
            <SidebarFieldRow>
              <FieldLabel>Tags</FieldLabel>
              <TagContainer>
                {ticket.tags.map((tag, index) => (
                  <Tag key={index} size="small">
                    <span>{tag}</span>
                  </Tag>
                ))}
              </TagContainer>
            </SidebarFieldRow>
          )}
        </SidebarColumn>
      </GridContainer>

      {showSettings && (
        <FieldVisibilitySettings
          visibility={fieldVisibility}
          onSave={saveFieldVisibility}
          onClose={() => setShowSettings(false)}
        />
      )}
    </OverviewContainer>
  );
};
