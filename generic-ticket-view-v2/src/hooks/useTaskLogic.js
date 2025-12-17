import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import {
  fetchRecords,
  fetchCustomObjectRecord,
  fetchCustomObjectField
} from '../utils/zendesk';
import {
  TARGET_AUDIENCE_KEY
} from '../utils/constants';

const TASK_OBJECT_KEY = 'task';
const TASK_USER_TYPE_KEY = 'user_type';
const TASK_SUMMARY_KEY = 'summary';

export const useTaskLogic = (client, value, onChange, onRecordSelect) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  const [inputValue, setInputValue] = useState('');

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Dropdown States
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(null);

  const loadRecords = async () => {
    if (!client) return;
    try {
      const recs = await fetchRecords(client, TASK_OBJECT_KEY);
      setRecords(recs);
      setFilteredRecords(recs);
    } catch (err) {
      console.error('Failed to fetch Task records', err);
      setError('Failed to load options');
    }
  };

  useEffect(() => {
    loadRecords();
  }, [client]);

  useEffect(() => {
    const loadOptions = async () => {
      if (!client) return;

      try {
        // Fetch User Type Options from Target Audience Records (Lookup)
        const audienceRecords = await fetchRecords(client, TARGET_AUDIENCE_KEY);
        const audienceOptions = audienceRecords.map(r => ({ name: r.name, value: r.id }));
        setUserTypeOptions(audienceOptions);

      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };

    loadOptions();
  }, [client]);

  // Ensure the selected record is available
  useEffect(() => {
    const ensureSelectedRecord = async () => {
      if (!client || !value) return;

      const found = records.find(r => r.id === value);
      if (!found) {
        try {
          const record = await fetchCustomObjectRecord(client, TASK_OBJECT_KEY, value);
          if (record) {
            setRecords(prev => [...prev, record]);
          }
        } catch (err) {
          console.error("Failed to fetch selected Task record", err);
        }
      }
    };

    ensureSelectedRecord();
  }, [client, value, records.length]);

  const handleCreateRecord = async () => {
    if (!newTaskName) return;
    setIsCreating(true);

    const match = records.find(r => r.name.toLowerCase() === newTaskName.toLowerCase());
    if (match) {
      alert('Record already exists!');
      setIsCreating(false);
      return;
    }

    const payload = {
      custom_object_record: {
        name: newTaskName,
        custom_object_fields: {
          [TASK_USER_TYPE_KEY]: selectedUserType,
          [TASK_SUMMARY_KEY]: newSummary
        }
      }
    };

    try {
      const response = await client.request({
        url: `/api/v2/custom_objects/${TASK_OBJECT_KEY}/records`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload)
      });

      const newRecord = response.custom_object_record;
      await loadRecords();
      onChange(newRecord.id);
      if (onRecordSelect) onRecordSelect(newRecord);

      setIsModalVisible(false);
      setNewTaskName('');
      setNewSummary('');
      setSelectedUserType(null);

      client.invoke('notify', 'Task record created!', 'success');
    } catch (err) {
      console.error('Failed to create record', err);
      client.invoke('notify', 'Failed to create record.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const selectedRecord = records.find(r => r.id === value) || null;

  useEffect(() => {
    if (selectedRecord) {
      setInputValue(selectedRecord.name);
    }
  }, [selectedRecord]);

  const handleSearch = useCallback(({ inputValue }) => {
    if (inputValue !== undefined) {
      if (inputValue === '') {
        setFilteredRecords(records);
      } else {
        const regex = new RegExp(inputValue.replace(/[.*+?^${}()|[\]\\]/giu, '\\$&'), 'giu');
        setFilteredRecords(records.filter((record) => record.name.match(regex)));
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
  };
};
