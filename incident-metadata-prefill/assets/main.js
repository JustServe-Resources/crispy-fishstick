var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) =>
      x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// vfs:index.jsx
import { createRoot } from 'react-dom/client';
import React2, { useState as useState2, useEffect as useEffect2 } from 'react';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';

// vfs:components/IncidentPrefillApp.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@zendeskgarden/react-buttons';
import { Alert } from '@zendeskgarden/react-notifications';
import { Spinner } from '@zendeskgarden/react-loaders';
import { Well } from '@zendeskgarden/react-notifications';
import { Combobox, Field as DropdownField, Option } from '@zendeskgarden/react-dropdowns';

// vfs:styles/AppStyles.js
import styled from 'styled-components';
var AppContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
var Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
var SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
var MetadataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid ${(props) => (props.theme.colors.base === 'dark' ? '#444' : '#e9ebed')};

  &:last-child {
    border-bottom: none;
  }
`;
var Label = styled.span`
  font-weight: 600;
  color: ${(props) => (props.theme.colors.base === 'dark' ? '#ccc' : '#2f3941')};
  flex-shrink: 0;
  margin-right: 12px;
`;
var Value = styled.span`
  color: ${(props) => (props.theme.colors.base === 'dark' ? '#aaa' : '#68737d')};
  text-align: right;
  word-break: break-word;
`;

// vfs:components/IncidentPrefillApp.jsx
var INCIDENT_COUNT_FIELD_ID = '42620021764379';
var IncidentPrefillApp = () => {
  var _a;
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [problemTicket, setProblemTicket] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [incidentForm, setIncidentForm] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jiraFieldId, setJiraFieldId] = useState(null);
  const [featureRequestFieldId, setFeatureRequestFieldId] = useState(null);
  const [incidentCount, setIncidentCount] = useState(0);
  useEffect(() => {
    initializeApp();
  }, []);
  const initializeApp = () =>
    __async(void 0, null, function* () {
      var _a2;
      try {
        setLoading(true);
        setError(null);
        yield window.zafClient.invoke('resize', { width: '100%', height: '600px' });
        const ticketData = yield window.zafClient.get('ticket');
        const ticket = ticketData['ticket'];
        setCurrentTicket(ticket);
        const ticketFieldsData = yield window.zafClient.get('ticketFields');
        const ticketFields = ticketFieldsData['ticketFields'];
        const formField = ticketFields.find((f) => f.name === 'ticket_form_id');
        if (formField && formField.optionValues) {
          const incidentFormOption = formField.optionValues.find(
            (opt) => opt.name && opt.name.toLowerCase().includes('incident')
          );
          setIncidentForm(incidentFormOption);
        }
        const jiraField = ticketFields.find(
          (f) => f.title && f.title.toLowerCase().includes('jira')
        );
        if (jiraField) {
          setJiraFieldId(jiraField.name);
        }
        const featureRequestField = ticketFields.find(
          (f) => f.title && f.title.toLowerCase().includes('feature request')
        );
        if (featureRequestField) {
          setFeatureRequestFieldId(featureRequestField.name);
        }
        const problemFieldName =
          (_a2 = ticketFields.find((f) => f.name === 'problem')) == null ? void 0 : _a2.name;
        if (problemFieldName) {
          const problemData = yield window.zafClient.get(`ticket.customField:${problemFieldName}`);
          const problemTicketId = problemData[`ticket.customField:${problemFieldName}`];
          if (problemTicketId) {
            yield fetchProblemTicketWithCount(problemTicketId);
          }
        }
        setLoading(false);
      } catch (err) {
        setError(`Initialization error: ${JSON.stringify(err)}`);
        setLoading(false);
      }
    });
  const countIncidentsForProblem = (problemTicketId) =>
    __async(void 0, null, function* () {
      try {
        const response = yield window.zafClient.request({
          url: '/api/v2/search.json',
          type: 'GET',
          data: {
            query: `type:ticket fieldvalue:${problemTicketId}`,
            per_page: 100,
          },
        });
        if (response && response.results) {
          const incidents = response.results.filter(
            (ticket) =>
              ticket.type === 'incident' &&
              ticket.custom_fields &&
              ticket.custom_fields.some(
                (field) => field.value && field.value.toString() === problemTicketId.toString()
              )
          );
          return incidents.length;
        }
        return 0;
      } catch (err) {
        return 0;
      }
    });
  const fetchProblemTicketWithCount = (problemTicketId) =>
    __async(void 0, null, function* () {
      try {
        const response = yield window.zafClient.request({
          url: `/api/v2/tickets/${problemTicketId}.json`,
          type: 'GET',
        });
        if (response && response.ticket) {
          setProblemTicket(response.ticket);
          const count = yield countIncidentsForProblem(problemTicketId);
          setIncidentCount(count);
        }
      } catch (err) {
        setError(`Failed to fetch problem ticket: ${JSON.stringify(err)}`);
      }
    });
  const searchProblemTickets = (query) =>
    __async(void 0, null, function* () {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        setSearching(true);
        setError(null);
        const response = yield window.zafClient.request({
          url: '/api/v2/search.json',
          type: 'GET',
          data: {
            query: `type:ticket ${query}`,
            per_page: 20,
          },
        });
        if (response && response.results) {
          const problemTickets = response.results.filter((ticket) => ticket.type === 'problem');
          setSearchResults(problemTickets);
        } else {
          setSearchResults([]);
        }
        setSearching(false);
      } catch (err) {
        setError(`Search failed: ${JSON.stringify(err)}`);
        setSearching(false);
        setSearchResults([]);
      }
    });
  const handleSearchChange = (changes) =>
    __async(void 0, null, function* () {
      if (changes.inputValue !== void 0) {
        setSearchQuery(changes.inputValue);
        searchProblemTickets(changes.inputValue);
      }
      if (changes.selectionValue !== void 0 && changes.selectionValue) {
        const selectedTicket = searchResults.find(
          (t) => t.id.toString() === changes.selectionValue
        );
        if (selectedTicket) {
          setProblemTicket(selectedTicket);
          const count = yield countIncidentsForProblem(selectedTicket.id);
          setIncidentCount(count);
          setSearchQuery('');
          setSearchResults([]);
        }
      }
    });
  const prefillIncidentMetadata = () =>
    __async(void 0, null, function* () {
      var _a2;
      if (!problemTicket) {
        setError('No problem ticket selected');
        return;
      }
      try {
        setProcessing(true);
        setError(null);
        setSuccess(null);
        yield window.zafClient.set('ticket.type', 'incident');
        if (incidentForm && incidentForm.value) {
          yield window.zafClient.set('ticket.form', { id: incidentForm.value });
        }
        if (jiraFieldId && problemTicket.custom_fields && problemTicket.custom_fields.length > 0) {
          const jiraField = problemTicket.custom_fields.find(
            (f) => f.id.toString() === jiraFieldId.replace('custom_field_', '')
          );
          if (jiraField && jiraField.value) {
            yield window.zafClient.set(`ticket.customField:${jiraFieldId}`, jiraField.value);
          }
        }
        if (
          featureRequestFieldId &&
          problemTicket.custom_fields &&
          problemTicket.custom_fields.length > 0
        ) {
          const featureRequestField = problemTicket.custom_fields.find(
            (f) => f.id.toString() === featureRequestFieldId.replace('custom_field_', '')
          );
          if (featureRequestField && featureRequestField.value) {
            yield window.zafClient.set(
              `ticket.customField:${featureRequestFieldId}`,
              featureRequestField.value
            );
          }
        }
        const ticketFieldsData = yield window.zafClient.get('ticketFields');
        const ticketFields = ticketFieldsData['ticketFields'];
        const problemFieldName =
          (_a2 = ticketFields.find((f) => f.name === 'problem')) == null ? void 0 : _a2.name;
        if (problemFieldName) {
          yield window.zafClient.set(`ticket.customField:${problemFieldName}`, problemTicket.id);
        }
        const newCount = incidentCount + 1;
        yield window.zafClient.request({
          url: `/api/v2/tickets/${problemTicket.id}.json`,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({
            ticket: {
              custom_fields: [
                {
                  id: INCIDENT_COUNT_FIELD_ID,
                  value: newCount,
                },
              ],
            },
          }),
        });
        setSuccess(
          `Successfully set ticket as incident of problem #${problemTicket.id}. Incident count updated to ${newCount}.`
        );
        setIncidentCount(newCount);
        setProcessing(false);
      } catch (err) {
        setError(`Failed to set incident: ${JSON.stringify(err)}`);
        setProcessing(false);
      }
    });
  if (loading) {
    return React.createElement(
      AppContainer,
      null,
      React.createElement(Section, null, React.createElement(Spinner, { size: '32' }))
    );
  }
  return React.createElement(
    AppContainer,
    null,
    error &&
      React.createElement(
        Alert,
        { type: 'error' },
        React.createElement(Alert.Title, null, 'Error'),
        React.createElement(Alert.Paragraph, null, error)
      ),
    success &&
      React.createElement(
        Alert,
        { type: 'success' },
        React.createElement(Alert.Title, null, 'Success'),
        React.createElement(Alert.Paragraph, null, success)
      ),
    React.createElement(
      SearchSection,
      null,
      React.createElement(
        DropdownField,
        null,
        React.createElement(DropdownField.Label, null, 'Search for Problem Ticket'),
        React.createElement(DropdownField.Hint, null, 'Enter ticket ID or subject to search'),
        React.createElement(
          Combobox,
          {
            inputValue: searchQuery,
            onChange: handleSearchChange,
            isAutocomplete: true,
          },
          searching && React.createElement(Option, { value: '', isDisabled: true }, 'Searching...'),
          !searching &&
            searchResults.length === 0 &&
            searchQuery.length >= 2 &&
            React.createElement(
              Option,
              { value: '', isDisabled: true },
              'No problem tickets found'
            ),
          !searching &&
            searchResults.map((ticket) =>
              React.createElement(
                Option,
                { key: ticket.id, value: ticket.id.toString() },
                '#',
                ticket.id,
                ' - ',
                ticket.subject
              )
            )
        )
      )
    ),
    problemTicket &&
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          Section,
          null,
          React.createElement(
            Well,
            null,
            React.createElement(Well.Title, null, 'Selected Problem Ticket'),
            React.createElement(
              MetadataRow,
              null,
              React.createElement(Label, null, 'Ticket ID:'),
              React.createElement(Value, null, '#', problemTicket.id)
            ),
            React.createElement(
              MetadataRow,
              null,
              React.createElement(Label, null, 'Subject:'),
              React.createElement(Value, null, problemTicket.subject)
            ),
            jiraFieldId &&
              problemTicket.custom_fields &&
              React.createElement(
                MetadataRow,
                null,
                React.createElement(Label, null, 'Jira ID:'),
                React.createElement(
                  Value,
                  null,
                  ((_a = problemTicket.custom_fields.find(
                    (f) => f.id.toString() === jiraFieldId.replace('custom_field_', '')
                  )) == null
                    ? void 0
                    : _a.value) || 'None'
                )
              ),
            React.createElement(
              MetadataRow,
              null,
              React.createElement(Label, null, 'Incident Count:'),
              React.createElement(Value, null, incidentCount)
            )
          )
        ),
        React.createElement(
          Section,
          null,
          React.createElement(
            Button,
            {
              isPrimary: true,
              onClick: prefillIncidentMetadata,
              disabled: processing,
            },
            processing ? 'Processing...' : 'Set Ticket as Incident of Selected Problem'
          )
        )
      )
  );
};

// vfs:index.jsx
var queryParams = new URLSearchParams(location.search);
var initialColorScheme = queryParams.get('colorScheme') || 'light';
var App = () => {
  const [base, setBase] = useState2(initialColorScheme);
  useEffect2(() => {
    window.zafClient.get('colorScheme').then((data) => setBase(data.colorScheme));
    window.zafClient.on('colorScheme.changed', (colorScheme) => setBase(colorScheme));
  }, []);
  const themeObject = __spreadProps(__spreadValues({}, DEFAULT_THEME), {
    colors: __spreadProps(__spreadValues({}, DEFAULT_THEME.colors), { base }),
  });
  return React2.createElement(
    ThemeProvider,
    { theme: themeObject },
    React2.createElement(IncidentPrefillApp, null)
  );
};
var index_default = App;
var ErrorBoundary = class extends React2.Component {
  constructor(props) {
    super(props);
    __publicField(this, 'copyErrorToClipboard', () => {
      var _a, _b;
      const errorMessage =
        ((_a = this.state.error) == null ? void 0 : _a.toString()) || 'Unknown error';
      const errorStack = ((_b = this.state.error) == null ? void 0 : _b.stack) || '';
      const fullErrorText = errorStack || errorMessage;
      navigator.clipboard.writeText(fullErrorText);
      this.setState({ copied: true });
      setTimeout(() => {
        this.setState({ copied: false });
      }, 2e3);
    });
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    const errorMessage = error.toString();
    const errorStack = error.stack || '';
    window.parent.postMessage(
      {
        type: 'iframe-error',
        error: errorMessage,
        stack: errorStack,
      },
      '*'
    );
  }
  render() {
    var _a, _b;
    if (this.state.hasError) {
      const errorStack =
        ((_a = this.state.error) == null ? void 0 : _a.stack) ||
        ((_b = this.state.error) == null ? void 0 : _b.toString()) ||
        'Unknown error';
      return React2.createElement(
        'div',
        {
          style: {
            fontSize: '16px',
            display: 'grid',
            padding: '20px',
          },
        },
        React2.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            },
          },
          React2.createElement(
            'h4',
            {
              style: {
                marginBottom: '8px',
                color: '#d93f4c',
              },
            },
            'An error occurred in your application'
          ),
          React2.createElement(
            'p',
            {
              style: {
                marginBottom: '16px',
                color: '#49545c',
                maxWidth: '600px',
              },
            },
            'To resolve this issue, please copy the error message below and paste it back into the app builder. App Builder will automatically attempt to fix this issue.'
          ),
          React2.createElement(
            'button',
            {
              onClick: this.copyErrorToClipboard,
              title: 'Click to copy error message',
              style: {
                marginBottom: '16px',
                padding: '8px 16px',
                border: '1px solid #c1c3c5',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                ':hover': {
                  background: '#f8f9f9',
                  borderColor: '#68737d',
                },
              },
            },
            this.state.copied
              ? React2.createElement(
                  React2.Fragment,
                  null,
                  React2.createElement('span', { style: { color: '#1f73b7' } }, 'Copied!')
                )
              : React2.createElement(React2.Fragment, null, 'Copy error')
          ),
          React2.createElement(
            'pre',
            {
              style: {
                background: '#f8f9f9',
                padding: '16px',
                borderRadius: '4px',
                maxWidth: '600px',
                overflow: 'auto',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                lineHeight: '1.5',
              },
            },
            errorStack
          )
        )
      );
    }
    return this.props.children;
  }
};
var AppWithErrorBoundary = () =>
  React2.createElement(ErrorBoundary, null, React2.createElement(App, null));
try {
  createRoot(document.getElementById('root')).render(
    React2.createElement(AppWithErrorBoundary, null)
  );
} catch (error) {
  console.log({ error });
  window.parent.postMessage(
    {
      type: 'iframe-error',
      error: error.toString(),
      stack: error.stack || '',
    },
    '*'
  );
}
export { index_default as default };
