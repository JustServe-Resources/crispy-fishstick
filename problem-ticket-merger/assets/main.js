var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
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
import { ThemeProvider } from '@zendeskgarden/react-theming';

// vfs:styles/AppStyles.js
import styled from 'styled-components';
var AppContainer = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`;

// vfs:components/ProblemMerger.jsx
import React, { useState, useEffect } from 'react';
import { Field, Label, Input, Message } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';
import { Alert, Title as AlertTitle } from '@zendeskgarden/react-notifications';
import {
  Modal,
  Header,
  Body as ModalBody,
  Footer,
  FooterItem,
  Close as ModalClose,
} from '@zendeskgarden/react-modals';
import { Dots } from '@zendeskgarden/react-loaders';

// vfs:styles/ProblemMergerStyles.js
import styled2 from 'styled-components';
var Container = styled2.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;
var MergerContainer = styled2.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;
var Section = styled2.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border: 1px solid #d8dcde;
        border-radius: 4px;
      `;
var SectionTitle = styled2.h3`
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #2f3941;
      `;
var InfoText = styled2.p`
        margin: 0;
        font-size: 13px;
        color: #68737d;
        line-height: 1.5;
      `;
var ButtonContainer = styled2.div`
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
      `;
var IncidentCount = styled2.div`
        padding: 12px;
        background-color: #edf7ff;
        border-left: 4px solid #1f73b7;
        font-size: 14px;
        font-weight: 600;
        color: #2f3941;
      `;
var TicketInfo = styled2.div`
        font-size: 13px;
        color: #2f3941;
        line-height: 1.6;

        strong {
          font-weight: 600;
          margin-right: 4px;
        }
      `;
var LoadingContainer = styled2.div`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
      `;
var ModalContent = styled2.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;
var ModalSection = styled2.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background-color: #f8f9f9;
        border-radius: 4px;
      `;
var ModalLabel = styled2.div`
        font-size: 12px;
        font-weight: 600;
        color: #68737d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      `;
var ModalValue = styled2.div`
        font-size: 14px;
        color: #2f3941;
        line-height: 1.5;
      `;
var ActionList = styled2.ul`
        margin: 0;
        padding-left: 20px;
        font-size: 13px;
        color: #2f3941;
        line-height: 1.8;

        li {
          margin-bottom: 4px;
        }
      `;

// vfs:components/ProblemMerger.jsx
var ProblemMerger = ({ currentTicket }) => {
  const [targetTicketId, setTargetTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mergeData, setMergeData] = useState(null);
  const validateAndPrepareMerge = () =>
    __async(void 0, null, function* () {
      setError('');
      setSuccess('');
      setLoading(true);
      try {
        const targetId = parseInt(targetTicketId.trim());
        if (!targetId || isNaN(targetId)) {
          setError('Please enter a valid ticket ID');
          setLoading(false);
          return;
        }
        if (targetId === currentTicket.id) {
          setError('Cannot merge a ticket into itself');
          setLoading(false);
          return;
        }
        const targetTicketResponse = yield window.zafClient.request({
          url: `/api/v2/tickets/${targetId}.json`,
          type: 'GET',
        });
        const targetTicket = targetTicketResponse.ticket;
        if (targetTicket.type !== 'problem') {
          setError('Target ticket must be a problem ticket');
          setLoading(false);
          return;
        }
        const incidentsResponse = yield window.zafClient.request({
          url: `/api/v2/tickets/${currentTicket.id}/incidents.json`,
          type: 'GET',
        });
        const incidents = incidentsResponse.tickets || [];
        setMergeData({
          targetTicket,
          incidents,
          incidentCount: incidents.length,
        });
        setShowConfirmModal(true);
        setLoading(false);
      } catch (err) {
        setError(`Failed to validate merge: ${JSON.stringify(err)}`);
        setLoading(false);
      }
    });
  const performMerge = () =>
    __async(void 0, null, function* () {
      setShowConfirmModal(false);
      setLoading(true);
      setError('');
      try {
        const { targetTicket, incidents } = mergeData;
        if (incidents.length > 0) {
          const ticketUpdates = incidents.map((incident) => ({
            id: incident.id,
            problem_id: targetTicket.id,
          }));
          yield window.zafClient.request({
            url: '/api/v2/tickets/update_many.json',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
              tickets: ticketUpdates,
            }),
          });
        }
        const currentTags = currentTicket.tags || [];
        const updatedTags = currentTags.filter((tag) => tag !== 'to_be_merged');
        updatedTags.push('merged_to_problem');
        yield window.zafClient.request({
          url: `/api/v2/tickets/${currentTicket.id}.json`,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({
            ticket: {
              tags: updatedTags,
              comment: {
                body: `This problem ticket has been merged into problem ticket #${targetTicket.id}. All ${incidents.length} incident(s) have been re-linked to the target problem. This ticket can now be closed.`,
                public: false,
              },
            },
          }),
        });
        setSuccess(
          `Successfully merged ${incidents.length} incident(s) to problem ticket #${targetTicket.id}. Navigating to target ticket...`
        );
        setTargetTicketId('');
        setMergeData(null);
        setLoading(false);
        setTimeout(() => {
          window.zafClient.invoke('routeTo', 'ticket', targetTicket.id);
        }, 2e3);
      } catch (err) {
        setError(`Failed to perform merge: ${JSON.stringify(err)}`);
        setLoading(false);
        setMergeData(null);
      }
    });
  return React.createElement(
    Container,
    null,
    React.createElement(
      Section,
      null,
      React.createElement(InfoText, null, 'Current Problem Ticket: #', currentTicket.id),
      React.createElement(InfoText, null, currentTicket.subject)
    ),
    React.createElement(
      Section,
      null,
      React.createElement(
        Field,
        null,
        React.createElement(Label, null, 'Target Problem Ticket ID'),
        React.createElement(Input, {
          value: targetTicketId,
          onChange: (e) => setTargetTicketId(e.target.value),
          placeholder: 'Enter ticket ID',
          disabled: loading,
        }),
        React.createElement(Message, null, 'Enter the ID of the problem ticket to merge into')
      )
    ),
    error &&
      React.createElement(
        Section,
        null,
        React.createElement(
          Alert,
          { type: 'error' },
          React.createElement(AlertTitle, null, 'Error'),
          error
        )
      ),
    success &&
      React.createElement(
        Section,
        null,
        React.createElement(
          Alert,
          { type: 'success' },
          React.createElement(AlertTitle, null, 'Success'),
          success
        )
      ),
    React.createElement(
      ButtonContainer,
      null,
      React.createElement(
        Button,
        {
          isPrimary: true,
          onClick: validateAndPrepareMerge,
          disabled: loading || !targetTicketId.trim(),
        },
        loading ? 'Processing...' : 'Preview Merge'
      )
    ),
    loading &&
      React.createElement(LoadingContainer, null, React.createElement(Dots, { size: '32' })),
    showConfirmModal &&
      mergeData &&
      React.createElement(
        Modal,
        { onClose: () => setShowConfirmModal(false) },
        React.createElement(Header, null, 'Confirm Problem Ticket Merge'),
        React.createElement(
          ModalBody,
          null,
          React.createElement(
            ModalContent,
            null,
            React.createElement(
              ModalSection,
              null,
              React.createElement(ModalLabel, null, 'Source Problem:'),
              React.createElement(
                ModalValue,
                null,
                '#',
                currentTicket.id,
                ' - ',
                currentTicket.subject
              )
            ),
            React.createElement(
              ModalSection,
              null,
              React.createElement(ModalLabel, null, 'Target Problem:'),
              React.createElement(
                ModalValue,
                null,
                '#',
                mergeData.targetTicket.id,
                ' - ',
                mergeData.targetTicket.subject
              ),
              React.createElement(ModalValue, null, 'Status: ', mergeData.targetTicket.status)
            ),
            React.createElement(
              ModalSection,
              null,
              React.createElement(ModalLabel, null, 'Incidents to Re-link:'),
              React.createElement(
                ModalValue,
                null,
                mergeData.incidentCount,
                ' incident ticket(s) will be re-linked to the target problem'
              )
            ),
            React.createElement(
              ModalSection,
              null,
              React.createElement(ModalLabel, null, 'Actions that will be performed:'),
              React.createElement(
                ActionList,
                null,
                React.createElement(
                  'li',
                  null,
                  'Re-link ',
                  mergeData.incidentCount,
                  ' incident(s) to target problem #',
                  mergeData.targetTicket.id
                ),
                React.createElement('li', null, "Add 'merged_to_problem' tag to source problem"),
                React.createElement('li', null, "Remove 'to_be_merged' tag if present"),
                React.createElement('li', null, 'Add internal comment noting the merge'),
                React.createElement('li', null, 'Navigate to target problem ticket')
              )
            )
          )
        ),
        React.createElement(
          Footer,
          null,
          React.createElement(
            FooterItem,
            null,
            React.createElement(Button, { onClick: () => setShowConfirmModal(false) }, 'Cancel')
          ),
          React.createElement(
            FooterItem,
            null,
            React.createElement(Button, { isPrimary: true, onClick: performMerge }, 'Confirm Merge')
          )
        ),
        React.createElement(ModalClose, { 'aria-label': 'Close modal' })
      )
  );
};

// vfs:index.jsx
var App = () => {
  const [currentTicket, setCurrentTicket] = useState2(null);
  const [loading, setLoading] = useState2(true);
  const [error, setError] = useState2(null);
  useEffect2(() => {
    const initializeApp = () =>
      __async(void 0, null, function* () {
        try {
          yield window.zafClient.invoke('resize', { width: '100%', height: '600px' });
          const ticketData = yield window.zafClient.get([
            'ticket.id',
            'ticket.type',
            'ticket.subject',
          ]);
          if (ticketData['ticket.type'] !== 'problem') {
            setError(
              'This app only works with problem tickets. Current ticket type: ' +
                ticketData['ticket.type']
            );
            setLoading(false);
            return;
          }
          setCurrentTicket({
            id: ticketData['ticket.id'],
            type: ticketData['ticket.type'],
            subject: ticketData['ticket.subject'],
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to initialize app: ' + JSON.stringify(err));
          setLoading(false);
        }
      });
    initializeApp();
  }, []);
  if (loading) {
    return React2.createElement(
      ThemeProvider,
      null,
      React2.createElement(AppContainer, null, React2.createElement('p', null, 'Loading...'))
    );
  }
  if (error) {
    return React2.createElement(
      ThemeProvider,
      null,
      React2.createElement(
        AppContainer,
        null,
        React2.createElement('p', { style: { color: 'red' } }, error)
      )
    );
  }
  return React2.createElement(
    ThemeProvider,
    null,
    React2.createElement(AppContainer, null, React2.createElement(ProblemMerger, { currentTicket }))
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
