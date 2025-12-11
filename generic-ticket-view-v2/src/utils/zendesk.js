export const fetchKnowledgeGapRecords = async (client) => {
  if (!client) throw new Error('ZAF Client is required');
  const response = await client.request('/api/v2/custom_objects/knowledge_gap/records');
  return response.custom_object_records || [];
};

export const fetchTicketField = async (client, fieldId) => {
  if (!client) throw new Error('ZAF Client is required');
  const response = await client.request(`/api/v2/ticket_fields/${fieldId}.json`);
  return response.ticket_field;
};

export const fetchCustomObjectField = async (client, objectKey, fieldKey) => {
  if (!client) throw new Error('ZAF Client is required');
  const response = await client.request(`/api/v2/custom_objects/${objectKey}/fields/${fieldKey}`);
  return response.custom_object_field;
};

export const fetchCustomObjectFields = async (client, objectKey) => {
  if (!client) throw new Error('ZAF Client is required');
  const response = await client.request(`/api/v2/custom_objects/${objectKey}/fields`);
  return response.custom_object_fields || [];
};

export const fetchRecords = async (client, objectKey) => {
  if (!client) throw new Error('ZAF Client is required');
  const response = await client.request(`/api/v2/custom_objects/${objectKey}/records`);
  return response.custom_object_records || [];
};

export const fetchCustomObjectRecord = async (client, objectKey, recordId) => {
  if (!client) throw new Error('ZAF Client is required');
  const response = await client.request(`/api/v2/custom_objects/${objectKey}/records/${recordId}`);
  return response.custom_object_record;
};
