import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { fetchRecords } from '../utils/zendesk';
import {
  TICKET_TYPES
} from '../utils/constants';

const DEFECT_OBJECT_KEY = 'defect';

// Ticket Fields for Creating a Problem/Defect
const FIELDS = {
  STEPS_TO_PRODUCE: 'custom_fields.30574241522075',
  EXPECTED_BEHAVIOR: 'custom_fields.30572845583899',
  ACTUAL_BEHAVIOR: 'custom_fields.30573553563675',
  INTERNAL_NOTES: 'custom_fields.37453127421979'
};

export const useProblemLogic = (client, value, onChange, onRecordSelect) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  const [inputValue, setInputValue] = useState('');

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [newExpected, setNewExpected] = useState('');
  const [newActual, setNewActual] = useState('');

  // New State for Internal Notes & Attachments
  const [newInternalNotes, setNewInternalNotes] = useState('');
  const [newAttachments, setNewAttachments] = useState([]);

  const [isCreating, setIsCreating] = useState(false);


  const loadRecords = async () => {
    if (!client) return;
    try {
      // NOTE: Problems are Tickets of type "problem", NOT custom objects.
      // We need to fetch tickets where type == 'problem'
      // Using search API is better for this: type:ticket ticket_type:problem
      const response = await client.request('/api/v2/search.json?query=type:ticket ticket_type:problem status<solved');
      const recs = response.results || [];
      setRecords(recs);
      setFilteredRecords(recs);
    } catch (err) {
      console.error('Failed to fetch Problem tickets', err);
      setError('Failed to load options');
    }
  };

  useEffect(() => {
    loadRecords();
  }, [client]);


  // Ensure selected record is loaded (if passed as value)
  useEffect(() => {
    if (value && !records.find(r => r.id === value)) {
      // If value exists but not in list, fetch it
      client.request(`/api/v2/tickets/${value}.json`).then(res => {
        if (res.ticket) setRecords(prev => [...prev, res.ticket]);
      }).catch(console.error);
    }
  }, [value, client, records.length]);

  const uploadFile = async (file) => {
    try {
      const response = await client.request({
        url: `/api/v2/uploads.json?filename=${file.name}`,
        type: 'POST',
        contentType: file.type,
        data: file
      });
      return response.upload.token;
    } catch (error) {
      console.error('File upload failed', error);
      client.invoke('notify', `Failed to upload ${file.name}`, 'error');
      return null;
    }
  };

  const handleCreateRecord = async () => {
    if (!newSubject || !newSteps) return;
    setIsCreating(true);

    try {
      // 1. Upload Attachments
      const uploadTokens = [];
      for (const fileItem of newAttachments) {
        const token = await uploadFile(fileItem);
        if (token) uploadTokens.push(token);
      }

      // 2. Prepare Payload
      const payload = {
        ticket: {
          subject: newSubject,
          description: newSteps,
          type: 'problem',
          comment: {
            body: newSteps,
            uploads: uploadTokens
          },
          custom_fields: []
        }
      };

      // Fields: Steps, Expected, Actual
      payload.ticket.custom_fields.push({ id: 30574241522075, value: newSteps });
      payload.ticket.custom_fields.push({ id: 30572845583899, value: newExpected });
      payload.ticket.custom_fields.push({ id: 30573553563675, value: newActual });

      // Field: Internal Notes (37453127421979)
      if (newInternalNotes) {
        payload.ticket.custom_fields.push({ id: 37453127421979, value: newInternalNotes });
      }

      // 3. Create Ticket
      const response = await client.request({
        url: '/api/v2/tickets.json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload)
      });

      const newTicket = response.ticket;
      await loadRecords();
      onChange(newTicket.id);
      if (onRecordSelect) onRecordSelect(newTicket);

      setIsModalVisible(false);
      setNewSubject('');
      setNewSteps('');
      setNewExpected('');
      setNewActual('');
      setNewInternalNotes('');
      setNewAttachments([]);

      client.invoke('notify', 'Problem created!', 'success');
    } catch (err) {
      console.error('Failed to create problem', err);
      client.invoke('notify', 'Failed to create problem.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const selectedRecord = records.find(r => r.id === value) || null;

  useEffect(() => {
    if (selectedRecord) {
      setInputValue(selectedRecord.subject);
    }
  }, [selectedRecord]);

  const handleSearch = useCallback(({ inputValue }) => {
    if (inputValue !== undefined) {
      if (inputValue === '') {
        setFilteredRecords(records);
      } else {
        const regex = new RegExp(inputValue.replace(/[.*+?^${}()|[\]\\]/giu, '\\$&'), 'giu');
        setFilteredRecords(records.filter((record) => record.subject.match(regex)));
      }
    }
  }, [records]);

  const debouncedHandleSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  return {
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
  };
};
