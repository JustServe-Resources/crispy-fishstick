import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import { Field, Label, Input, Textarea, Select } from '@zendeskgarden/react-forms';
import { Field as DropdownField, Label as DropdownLabel } from '@zendeskgarden/react-dropdowns';
import { Button } from '@zendeskgarden/react-buttons';
import { Tag } from '@zendeskgarden/react-tags';
import { Accordion } from '@zendeskgarden/react-accordions';
import MarkdownRenderer from './MarkdownRenderer';
import KnowledgeGapSelector from './KnowledgeGapSelector';

const INTERNAL_NOTES_FIELD_ID = 37453127421979;
const TASK_FIELD_ID = 38720689571483;
const KNOWLEDGE_GAP_FIELD_ID = 38622750189851;
const FORM_ID_TASK = 40371906157979;

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  input {
    font-size: 24px;
    font-weight: bold;
    border: 1px solid transparent;
    &:hover, &:focus {
      border-color: #ddd;
    }
  }
`;

const NotesSection = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const Sidebar = styled.div`
  border-left: 1px solid #eee;
  padding-left: 20px;
`;

const TicketOverview = () => {
  const [client, setClient] = useState(null);
  const [ticket, setTicket] = useState({
    subject: '',
    requester: { name: '' },
    type: '',
    assignee: { user: { name: '' } },
    tags: [],
    custom_fields: {}
  });
  const [pendingChanges, setPendingChanges] = useState({});
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const zafClient = window.zafClient || window.ZAFClient.init();
    setClient(zafClient);
    zafClient.invoke('resize', { width: '100%', height: '600px' });

    // Fetch standard fields and relevant custom fields
    zafClient.get([
      'ticket',
      `ticket.customField:custom_field_${INTERNAL_NOTES_FIELD_ID}`,
      `ticket.customField:custom_field_${KNOWLEDGE_GAP_FIELD_ID}`
    ]).then((data) => {
      console.log('ZAF Fetch Result:', JSON.stringify(data, null, 2));
      setTicket({
        ...data.ticket,
        custom_fields: {
          [INTERNAL_NOTES_FIELD_ID]: data[`ticket.customField:custom_field_${INTERNAL_NOTES_FIELD_ID}`],
          [KNOWLEDGE_GAP_FIELD_ID]: data[`ticket.customField:custom_field_${KNOWLEDGE_GAP_FIELD_ID}`]
        }
      });
    });

    // Fetch tasks if type is task (mock implementation for now)
  }, []);

  // State for data consistency
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const checkForUpdates = useCallback(async () => {
    if (!client || !ticket.id) return;
    // Skip if we don't have a baseline yet
    if (!lastUpdatedAt) return;

    try {
      const data = await client.request(`/api/v2/tickets/${ticket.id}.json`);
      const remoteTime = data.ticket.updated_at;

      // If server time is different from our last known time, data has changed (by someone else)
      if (remoteTime !== lastUpdatedAt) {
        console.warn('Stale data detected!', { local: lastUpdatedAt, remote: remoteTime });
        setIsStale(true);
      }
    } catch (err) {
      console.error('Polling failed', err);
    }
  }, [client, ticket.id, lastUpdatedAt]);

  // Fetch initial baseline from API to ensure we have the canonical updated_at
  useEffect(() => {
    if (!client || !ticket.id) return;

    // Initial fetch for baseline timestamp
    client.request(`/api/v2/tickets/${ticket.id}.json`).then(data => {
      setLastUpdatedAt(data.ticket.updated_at);
    }).catch(err => console.error('Initial timestamp fetch failed', err));

    // Poll every 15 seconds
    const interval = setInterval(checkForUpdates, 15000);
    return () => clearInterval(interval);
  }, [client, ticket.id, checkForUpdates]);

  const refreshData = () => {
    if (!client || !ticket.id) return;
    client.request(`/api/v2/tickets/${ticket.id}.json`).then(data => {
      setTicket(prev => ({
        ...prev,
        ...data.ticket,
        // Ensure custom fields from refresh are merged correctly if key names differ
        // Note: data.ticket.custom_fields is an array [{id, value}, ...].
        // We need to map it to our internal object structure
      }));

      // Update custom fields map from the array response
      if (data.ticket.custom_fields) {
        const cfMap = {};
        data.ticket.custom_fields.forEach(f => { cfMap[f.id] = f.value; });
        setTicket(prev => ({
          ...prev,
          custom_fields: { ...prev.custom_fields, ...cfMap }
        }));
      }

      setLastUpdatedAt(data.ticket.updated_at);
      setIsStale(false);
      client.invoke('notify', 'Data refreshed from server', 'notice');
    });
  };

  const handleFieldChange = (field, value) => {
    setPendingChanges(prev => ({ ...prev, [field]: value }));
    setTicket(prev => {
      if (field.startsWith('custom_field_')) {
        const id = field.replace('custom_field_', '');
        return { ...prev, custom_fields: { ...prev.custom_fields, [id]: value } };
      }
      // Special case handling for 'type' change
      if (field === 'type') {
        // If generic type changes, we might want to clear related sub-fields
        // But for now, we leave them (preserving state if user switches back)
      }
      return { ...prev, [field]: value };
    });
  };

  const saveChanges = async () => {
    if (!client || !ticket.id) return;

    const ticketUpdateDesc = {
      ticket: {
        custom_fields: []
      }
    };

    Object.keys(pendingChanges).forEach(key => {
      // Handle custom fields
      if (key.startsWith('custom_field_')) {
        const id = parseInt(key.replace('custom_field_', ''), 10);
        ticketUpdateDesc.ticket.custom_fields.push({
          id: id,
          value: pendingChanges[key]
        });
      } else {
        // Handle standard fields (subject, type, etc.)
        const value = pendingChanges[key];
        ticketUpdateDesc.ticket[key] = (value === '') ? null : value;
      }
    });

    // Clean up custom_fields if empty
    if (ticketUpdateDesc.ticket.custom_fields.length === 0) {
      delete ticketUpdateDesc.ticket.custom_fields;
    }

    console.log('Sending API update:', JSON.stringify(ticketUpdateDesc, null, 2));

    try {
      const response = await client.request({
        url: `/api/v2/tickets/${ticket.id}.json`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(ticketUpdateDesc)
      });

      console.log('API Update Success:', response);

      // Sync our lastUpdatedAt with the new one from server
      setLastUpdatedAt(response.ticket.updated_at);
      setIsStale(false);

      // Notify user of success
      client.invoke('notify', 'Ticket saved successfully!', 'success');

      // Update local state to reflect saved changes
      setTicket(prev => {
        const newTicket = { ...prev };
        // Merge standard fields
        Object.keys(ticketUpdateDesc.ticket).forEach(key => {
          if (key !== 'custom_fields') {
            newTicket[key] = ticketUpdateDesc.ticket[key];
          }
        });
        // Merge custom fields
        if (ticketUpdateDesc.ticket.custom_fields) {
          ticketUpdateDesc.ticket.custom_fields.forEach(cf => {
            newTicket.custom_fields = { ...newTicket.custom_fields, [cf.id]: cf.value };
          });
        }
        return newTicket;
      });

      setPendingChanges({});
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Error saving changes via API:', error);
      client.invoke('notify', 'Failed to save ticket.', 'error');
    }
  };

  const discardChanges = () => {
    refreshData();
    setPendingChanges({});
    setIsEditingNotes(false);
  };

  const internalNotes = ticket.custom_fields?.[INTERNAL_NOTES_FIELD_ID] || '';
  const currentType = pendingChanges.type !== undefined ? pendingChanges.type : (ticket.type || '');
  const knowledgeGapValue = pendingChanges[`custom_field_${KNOWLEDGE_GAP_FIELD_ID}`] !== undefined
    ? pendingChanges[`custom_field_${KNOWLEDGE_GAP_FIELD_ID}`]
    : (ticket.custom_fields?.[KNOWLEDGE_GAP_FIELD_ID] || '');

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
        <Row>
          <Col size={9}>
            <NotesSection>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Label>Internal Notes</Label>
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
          </Col>

          <Col size={3}>
            <Sidebar>
              <Field>
                <Label>Requester</Label>
                <Input value={ticket.requester?.name || ''} readOnly />
              </Field>
              <Field className="mt-4">
                <Label>Type</Label>
                <Select
                  value={currentType}
                  onChange={(e) => {
                    handleFieldChange('type', e.target.value);
                  }}
                >
                  <option value="">Select type</option>
                  <option value="question">Question</option>
                  <option value="incident">Incident</option>
                  <option value="problem">Problem</option>
                  <option value="task">Task</option>
                </Select>
              </Field>

              {currentType === 'question' && (
                <KnowledgeGapSelector
                  client={client}
                  value={knowledgeGapValue}
                  onChange={(val) => handleFieldChange(`custom_field_${KNOWLEDGE_GAP_FIELD_ID}`, val)}
                />
              )}

              {ticket.type === 'task' && (
                <Field className="mt-4">
                  <Label>Task</Label>
                  <Input placeholder="Select task..." />
                </Field>
              )}

              <Field className="mt-4">
                <Label>Assignee</Label>
                <Input value={ticket.assignee?.user?.name || ''} readOnly />
              </Field>

              <div className="mt-4">
                <Label>Tags</Label>
                <div>
                  {ticket.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
              </div>
            </Sidebar>
          </Col>
        </Row>
      </Grid>

      {Object.keys(pendingChanges).length > 0 && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'white', padding: 10, boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: 4 }}>
          <span style={{ marginRight: 10, fontStyle: 'italic' }}>Unsaved changes...</span>
          <Button isDanger size="small" onClick={discardChanges} style={{ marginRight: 10 }}>Discard</Button>
          <Button isPrimary size="small" onClick={saveChanges}>Save All</Button>
        </div>
      )}
    </Container>
  );
};

export default TicketOverview;
