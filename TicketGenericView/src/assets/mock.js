window.zafClient = {
      get: function(path) {
        return new Promise(function(resolve) {
          if (Array.isArray(path)) {
            var result = {};
            path.forEach(function(p) {
              if (p === 'ticket') {
                result.ticket = {
                  id: 12345,
                  subject: 'Sample Ticket Subject',
                  status: 'open',
                  priority: 'normal',
                  type: 'task',
                  tags: ['sample', 'test'],
                  requester: { name: 'John Doe' },
                  assignee: { user: { name: 'Jane Smith' } },
                  description: '<p>This is the ticket description with <strong>HTML</strong> formatting.</p>'
                };
              } else if (p === 'ticketFields') {
                result.ticketFields = [
                  { id: 37453127421979, name: 'custom_field_37453127421979', label: 'Internal Notes', type: 'textarea' },
                  { id: 38720689571483, name: 'custom_field_38720689571483', label: 'Task Lookup', type: 'lookup' }
                ];
              } else if (p === 'ticket.customField:custom_field_37453127421979') {
                result['ticket.customField:custom_field_37453127421979'] = '# Sample Internal Notes\n\nThese are **markdown** formatted notes.\n\n- Item 1\n- Item 2';
              } else if (p === 'ticket.customField:custom_field_38720689571483') {
                result['ticket.customField:custom_field_38720689571483'] = '01234567-89ab-cdef-0123-456789abcdef';
              }
            });
            resolve(result);
          } else {
            var singleResult = {};
            if (path === 'ticket') {
              singleResult.ticket = {
                id: 12345,
                subject: 'Sample Ticket Subject',
                status: 'open',
                priority: 'normal',
                type: 'task',
                tags: ['sample', 'test'],
                requester: { name: 'John Doe' },
                assignee: { user: { name: 'Jane Smith' } },
                description: '<p>This is the ticket description with <strong>HTML</strong> formatting.</p>'
              };
            } else if (path === 'ticketFields') {
              singleResult.ticketFields = [
                { id: 37453127421979, name: 'custom_field_37453127421979', label: 'Internal Notes', type: 'textarea' },
                { id: 38720689571483, name: 'custom_field_38720689571483', label: 'Task Lookup', type: 'lookup' }
              ];
            } else if (path === 'ticket.customField:custom_field_37453127421979') {
              singleResult['ticket.customField:custom_field_37453127421979'] = '# Sample Internal Notes\n\nThese are **markdown** formatted notes.\n\n- Item 1\n- Item 2';
            } else if (path === 'ticket.customField:custom_field_38720689571483') {
              singleResult['ticket.customField:custom_field_38720689571483'] = '01234567-89ab-cdef-0123-456789abcdef';
            }
            resolve(singleResult);
          }
        });
      },
      set: function(path, value) {
        return new Promise(function(resolve) {
          console.log('Setting', path, 'to', value);
          resolve();
        });
      },
      request: function(options) {
        return new Promise(function(resolve) {
          if (options.url && options.url.includes('/api/v2/custom_objects/task/records')) {
            resolve({
              custom_object_records: [
                {
                  id: '01234567-89ab-cdef-0123-456789abcdef',
                  name: 'Website Redesign',
                  custom_object_key: 'task',
                  created_at: '2024-01-15T10:00:00Z',
                  updated_at: '2024-01-15T10:00:00Z'
                },
                {
                  id: '11234567-89ab-cdef-0123-456789abcdef',
                  name: 'Database Migration',
                  custom_object_key: 'task',
                  created_at: '2024-01-16T11:00:00Z',
                  updated_at: '2024-01-16T11:00:00Z'
                },
                {
                  id: '21234567-89ab-cdef-0123-456789abcdef',
                  name: 'API Integration',
                  custom_object_key: 'task',
                  created_at: '2024-01-17T12:00:00Z',
                  updated_at: '2024-01-17T12:00:00Z'
                },
                {
                  id: '31234567-89ab-cdef-0123-456789abcdef',
                  name: 'Security Audit',
                  custom_object_key: 'task',
                  created_at: '2024-01-18T13:00:00Z',
                  updated_at: '2024-01-18T13:00:00Z'
                }
              ]
            });
          }
          resolve({});
        });
      },
      invoke: function(action, arg1, arg2) {
        return new Promise(function(resolve) {
          console.log('Invoking', action, arg1, arg2);
          resolve();
        });
      }
    };