import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import {
  INTERNAL_NOTES_FIELD_ID,
  KNOWLEDGE_GAP_FIELD_ID,
  TICKET_FORM_MAPPING
} from '../utils/constants';

export const useTicketLogic = () => {
  const [client, setClient] = useState(null);
  const [ticket, setTicket] = useState({
    subject: '',
    requester: { name: '' },
    type: '',
    assignee: { user: { name: '' } },
    tags: [],
    custom_fields: {}
  });

  // Pending changes are now just for local controlled input state before ZAF confirms
  const [pendingChanges, setPendingChanges] = useState({});
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [ticketFields, setTicketFields] = useState([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // Initialize Client and Fetch Base Data
  useEffect(() => {
    const zafClient = window.zafClient || window.ZAFClient.init();
    setClient(zafClient);
    zafClient.invoke('resize', { width: '100%', height: '600px' });

    // Initial Data Fetch
    zafClient.get(['ticket', 'ticketFields']).then((data) => {
      if (data.ticketFields) {
        setTicketFields(data.ticketFields);
      }

      const ticketData = data.ticket;
      setTicket({
        ...ticketData,
        custom_fields: {
          [INTERNAL_NOTES_FIELD_ID]: (ticketData.custom_fields || []).find(cf => cf.id === INTERNAL_NOTES_FIELD_ID)?.value,
          [KNOWLEDGE_GAP_FIELD_ID]: (ticketData.custom_fields || []).find(cf => cf.id === KNOWLEDGE_GAP_FIELD_ID)?.value
        }
      });
    });

    // Listen for Ticket Save to refresh data
    zafClient.on('ticket.save', () => {
      refreshData();
    });

    // Listen for external changes if possible, or just rely on polling
  }, []);

  // Polling for Updates
  const checkForUpdates = useCallback(async () => {
    if (!client || !ticket.id || !lastUpdatedAt) return;

    try {
      const data = await client.request(`/api/v2/tickets/${ticket.id}.json`);
      const remoteTime = data.ticket.updated_at;

      if (remoteTime !== lastUpdatedAt) {
        console.warn('Stale data detected!', { local: lastUpdatedAt, remote: remoteTime });
        setIsStale(true);
      }
    } catch (err) {
      console.error('Polling failed', err);
    }
  }, [client, ticket.id, lastUpdatedAt]);

  // Initial Baseline Fetch & Polling Setup
  useEffect(() => {
    if (!client || !ticket.id) return;

    client.request(`/api/v2/tickets/${ticket.id}.json`).then(data => {
      setLastUpdatedAt(data.ticket.updated_at);
      setTicket(prev => ({ ...prev, ...data.ticket }));

      if (data.ticket.custom_fields) {
        const cfMap = {};
        data.ticket.custom_fields.forEach(f => { cfMap[f.id] = f.value; });
        setTicket(prev => ({
          ...prev,
          custom_fields: { ...prev.custom_fields, ...cfMap }
        }));
      }
    }).catch(err => console.error('Initial timestamp fetch failed', err));

    const interval = setInterval(checkForUpdates, 15000);
    return () => clearInterval(interval);
  }, [client, ticket.id, checkForUpdates]);

  const refreshData = () => {
    if (!client || !ticket.id) return;
    client.request(`/api/v2/tickets/${ticket.id}.json`).then(data => {
      setTicket(prev => ({
        ...prev,
        ...data.ticket,
      }));

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
      setPendingChanges({}); // Clear pending changes on refresh as we are syncing with server
      client.invoke('notify', 'Data refreshed from server', 'notice');
    });
  };

  // Debounced ZAF Setter to avoid spamming the interface framework
  const updateZendeskField = useCallback((field, value) => {
    if (!client) return;

    // Map 'custom_field_123' to 'ticket.customField:custom_field_123' or just 'ticket.customField:123' usually
    // For standard fields: 'ticket.subject', 'ticket.type'

    let path = `ticket.${field}`;
    if (field.startsWith('custom_field_')) {
      const id = field.replace('custom_field_', '');
      path = `ticket.customField:custom_field_${id}`;
    }

    console.log(`Setting ${path} to`, value);
    client.set(path, value).catch(err => console.error(`Failed to set ${path}`, err));

    // Also handle Form Logic side effects
    if (field === 'type') {
      const newFormId = TICKET_FORM_MAPPING[value];
      if (newFormId) {
        client.set('ticket.form.id', newFormId);
      }
    }
  }, [client]);

  const debouncedUpdateZendesk = useMemo(
    () => debounce(updateZendeskField, 500),
    [updateZendeskField]
  );

  const handleFieldChange = (field, value) => {
    // 1. Update Local State (optimistic / controlled)
    setPendingChanges(prev => ({ ...prev, [field]: value }));

    // 2. Trigger ZAF Update
    // For text inputs, we debounce. For dropdowns, we might want immediate.
    // 'subject' and 'internal notes' (textarea) should be debounced.
    // 'type' and dropdowns should be immediate.

    const isTextInput = field === 'subject' || field.includes(INTERNAL_NOTES_FIELD_ID);

    if (isTextInput) {
      debouncedUpdateZendesk(field, value);
    } else {
      updateZendeskField(field, value);
    }
  };

  return {
    client,
    ticket,
    ticketFields,
    pendingChanges,
    isStale,
    isEditingNotes,
    setIsEditingNotes,
    refreshData,
    handleFieldChange
  };
};
