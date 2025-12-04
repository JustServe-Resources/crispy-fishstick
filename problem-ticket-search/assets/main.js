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
import React3, { useState as useState2, useEffect } from 'react';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';

// vfs:components/SearchContainer.jsx
import React2, { useState } from 'react';
import { Field, Label, Input, InputGroup } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';

// vfs:components/ResultsTable.jsx
import React from 'react';
import { Table } from '@zendeskgarden/react-tables';
import { Spinner } from '@zendeskgarden/react-loaders';

// vfs:styles/ResultsTable.js
import styled from 'styled-components';
var ResultsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
`;
var EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #68737d;
`;
var LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
`;
var SubjectLink = styled.span`
  color: #1f73b7;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// vfs:components/ResultsTable.jsx
var ResultsTable = ({ results, loading, hasSearched }) => {
  if (loading) {
    return React.createElement(LoadingWrapper, null, React.createElement(Spinner, null));
  }
  if (!hasSearched) {
    return React.createElement(EmptyState, null, 'Enter a search term to find problem tickets');
  }
  if (results.length === 0) {
    return React.createElement(EmptyState, null, 'No problem tickets found');
  }
  const openTicket = (ticketId) => {
    window.zafClient.invoke('routeTo', 'ticket', ticketId);
  };
  return React.createElement(
    ResultsWrapper,
    null,
    React.createElement(
      Table,
      { size: 'small' },
      React.createElement(
        Table.Head,
        null,
        React.createElement(
          Table.HeaderRow,
          null,
          React.createElement(Table.HeaderCell, null, 'Subject'),
          React.createElement(Table.HeaderCell, { width: '100px' }, 'Status')
        )
      ),
      React.createElement(
        Table.Body,
        null,
        results.map((ticket) =>
          React.createElement(
            Table.Row,
            { key: ticket.id },
            React.createElement(
              Table.Cell,
              null,
              React.createElement(
                SubjectLink,
                { onClick: () => openTicket(ticket.id) },
                ticket.subject || 'No subject'
              )
            ),
            React.createElement(Table.Cell, null, ticket.status)
          )
        )
      )
    )
  );
};

// vfs:styles/SearchContainer.js
import styled2 from 'styled-components';
var AppWrapper = styled2.div`
        padding: 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
      `;
var SearchSection = styled2.div`
        margin-bottom: 16px;
      `;
var SearchRow = styled2.div`
        margin-top: 12px;
        display: flex;
        justify-content: flex-start;
      `;

// vfs:components/SearchContainer.jsx
var SearchContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = () =>
    __async(void 0, null, function* () {
      if (!searchQuery.trim()) {
        setError('Enter a search term');
        return;
      }
      setLoading(true);
      setError('');
      setHasSearched(true);
      try {
        const response = yield window.zafClient.request({
          url: '/api/v2/search.json',
          type: 'GET',
          data: {
            query: `type:ticket ticket_type:problem ${searchQuery}`,
            sort_by: 'created_at',
            sort_order: 'desc',
          },
        });
        setResults(response.results || []);
      } catch (err) {
        setError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    });
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return React2.createElement(
    AppWrapper,
    null,
    React2.createElement(
      SearchSection,
      null,
      React2.createElement(
        Field,
        null,
        React2.createElement(Label, null, 'Search Problem Tickets'),
        React2.createElement(
          InputGroup,
          null,
          React2.createElement(Input, {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            onKeyPress: handleKeyPress,
            placeholder: 'Enter keywords to search subject and comments...',
          })
        )
      ),
      React2.createElement(
        SearchRow,
        null,
        React2.createElement(
          Button,
          { onClick: handleSearch, isPrimary: true, disabled: loading },
          loading ? 'Searching...' : 'Search'
        )
      )
    ),
    error && React2.createElement('div', { style: { color: 'red', padding: '12px' } }, error),
    React2.createElement(ResultsTable, { results, loading, hasSearched })
  );
};

// vfs:index.jsx
var queryParams = new URLSearchParams(location.search);
var initialColorScheme = queryParams.get('colorScheme') || 'light';
var App = () => {
  const [base, setBase] = useState2(initialColorScheme);
  useEffect(() => {
    window.zafClient.get('colorScheme').then((data) => setBase(data.colorScheme));
    window.zafClient.on('colorScheme.changed', (colorScheme) => setBase(colorScheme));
    window.zafClient.invoke('resize', { width: '700px', height: '600px' });
  }, []);
  const themeObject = __spreadProps(__spreadValues({}, DEFAULT_THEME), {
    colors: __spreadProps(__spreadValues({}, DEFAULT_THEME.colors), { base }),
  });
  return React3.createElement(
    ThemeProvider,
    { theme: themeObject },
    React3.createElement(SearchContainer, null)
  );
};
var index_default = App;
var ErrorBoundary = class extends React3.Component {
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
      return React3.createElement(
        'div',
        {
          style: {
            fontSize: '16px',
            display: 'grid',
            padding: '20px',
          },
        },
        React3.createElement(
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
          React3.createElement(
            'h4',
            {
              style: {
                marginBottom: '8px',
                color: '#d93f4c',
              },
            },
            'An error occurred in your application'
          ),
          React3.createElement(
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
          React3.createElement(
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
              ? React3.createElement(
                  React3.Fragment,
                  null,
                  React3.createElement('span', { style: { color: '#1f73b7' } }, 'Copied!')
                )
              : React3.createElement(React3.Fragment, null, 'Copy error')
          ),
          React3.createElement(
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
  React3.createElement(ErrorBoundary, null, React3.createElement(App, null));
try {
  createRoot(document.getElementById('root')).render(
    React3.createElement(AppWithErrorBoundary, null)
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
