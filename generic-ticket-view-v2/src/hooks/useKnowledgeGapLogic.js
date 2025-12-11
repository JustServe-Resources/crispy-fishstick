import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import {
  fetchKnowledgeGapRecords,
  fetchCustomObjectField,
  fetchCustomObjectFields,
  fetchRecords,
  fetchCustomObjectRecord
} from '../utils/zendesk';
import {
  CUSTOM_OBJECT_KEY,
  USER_TYPE_FIELD_KEY,
  SECTION_FIELD_ID,
  TARGET_AUDIENCE_KEY
} from '../utils/constants';

export const useKnowledgeGapLogic = (client, value, onChange, onRecordSelect) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  // We still need to control inputValue to display the selected record's name
  const [inputValue, setInputValue] = useState('');

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Multiselect State -> Single Select Dropdown
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(null);

  // Category/Section Sync State
  const [sectionFieldKey, setSectionFieldKey] = useState(null);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const loadRecords = async () => {
    if (!client) return;
    try {
      const recs = await fetchKnowledgeGapRecords(client);
      setRecords(recs);
      setFilteredRecords(recs);
    } catch (err) {
      console.error('Failed to fetch Knowledge Gap records', err);
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
        // 1. Fetch User Type Options from Target Audience Records
        // This was previously fetching field options, but it is a lookup to 'target_audience' records
        const audienceRecords = await fetchRecords(client, TARGET_AUDIENCE_KEY);
        const audienceOptions = audienceRecords.map(r => ({ name: r.name, value: r.id }));
        setUserTypeOptions(audienceOptions);

        // 2. Discover Section/Category Field Key (ID: 44256469941787)
        // We need the key to write back to it when creating a new record
        const allFields = await fetchCustomObjectFields(client, CUSTOM_OBJECT_KEY);
        const sectionField = allFields.find(f => f.id === SECTION_FIELD_ID);
        if (sectionField) {
          setSectionFieldKey(sectionField.key);
        } else {
          console.warn(`Could not find field with ID ${SECTION_FIELD_ID}`);
        }

        // 3. Fetch Section Records for Dropdown
        const sections = await fetchRecords(client, 'justserve_section');
        setSectionOptions(sections);

      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };

    loadOptions();
  }, [client]);

  // Ensure the selected record is available in the list
  useEffect(() => {
    const ensureSelectedRecord = async () => {
      if (!client || !value) return;

      const found = records.find(r => r.id === value);
      if (!found) {
        try {
          const record = await fetchCustomObjectRecord(client, CUSTOM_OBJECT_KEY, value);
          if (record) {
            setRecords(prev => [...prev, record]);
            // If we are not currently searching (filtering), update filtered list too? 
            // Better to leave filtered list as is unless we know we want to show it.
          }
        } catch (err) {
          console.error("Failed to fetch selected Knowledge Gap record", err);
        }
      }
    };

    ensureSelectedRecord();
  }, [client, value, records.length]);

  const handleCreateRecord = async () => {
    if (!newQuestion) return;
    setIsCreating(true);

    const match = records.find(r => r.name.toLowerCase() === newQuestion.toLowerCase());
    if (match) {
      alert('Record already exists!');
      setIsCreating(false);
      return;
    }

    const payload = {
      custom_object_record: {
        name: newQuestion,
        custom_object_fields: {
          [USER_TYPE_FIELD_KEY]: selectedUserType,
          knowledge_gap_notes: newNotes
        }
      }
    };

    if (sectionFieldKey && selectedSection) {
      payload.custom_object_record.custom_object_fields[sectionFieldKey] = selectedSection;
    }

    try {
      const response = await client.request({
        url: '/api/v2/custom_objects/knowledge_gap/records',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload)
      });

      const newRecord = response.custom_object_record;
      await loadRecords(); // Refresh all records
      onChange(newRecord.id);
      if (onRecordSelect) onRecordSelect(newRecord);

      setIsModalVisible(false);
      setNewQuestion('');
      setSelectedUserType(null);
      setSelectedSection(null);
      setNewNotes('');

      client.invoke('notify', 'Knowledge Gap record created!', 'success');
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

  // Direct search for the main Knowledge Gap dropdown (Local filtering doesn't need debounce)
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

  return {
    records,
    filteredRecords,
    error,
    inputValue,
    setInputValue,
    isModalVisible,
    setIsModalVisible,
    newQuestion,
    setNewQuestion,
    newNotes,
    setNewNotes,
    isCreating,
    userTypeOptions,
    selectedUserType,
    setSelectedUserType,
    sectionOptions,
    selectedSection,
    setSelectedSection,
    handleCreateRecord,
    selectedRecord,
    handleSearch
  };
};
