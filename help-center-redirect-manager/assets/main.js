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
import React7, { useState as useState4, useEffect as useEffect2 } from 'react';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';

// vfs:components/RedirectManager.jsx
import React6, { useState as useState3, useEffect } from 'react';
import { Button as Button5 } from '@zendeskgarden/react-buttons';
import { Alert, Title as AlertTitle } from '@zendeskgarden/react-notifications';
import { Inline } from '@zendeskgarden/react-loaders';

// vfs:components/RedirectTable.jsx
import React from 'react';
import { Table } from '@zendeskgarden/react-tables';
import { Button } from '@zendeskgarden/react-buttons';
import { Checkbox } from '@zendeskgarden/react-forms';

// vfs:styles/RedirectTable.js
import styled from 'styled-components';
var TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${(props) => (props.theme.colors.base === 'dark' ? '#444' : '#d8dcde')};
  border-radius: 4px;

  table {
    table-layout: fixed;
    width: 100%;
  }

  td,
  th {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 12px 16px;
  }
`;
var EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  p {
    margin: 0;
    color: ${(props) => (props.theme.colors.base === 'dark' ? '#aaa' : '#68737d')};
  }
`;
var StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    if (props.status === '301' || props.status === '308') {
      return props.theme.colors.base === 'dark' ? '#1f4788' : '#e3f2fd';
    }
    return props.theme.colors.base === 'dark' ? '#5a3d00' : '#fff3e0';
  }};
  color: ${(props) => {
    if (props.status === '301' || props.status === '308') {
      return props.theme.colors.base === 'dark' ? '#90caf9' : '#1976d2';
    }
    return props.theme.colors.base === 'dark' ? '#ffb74d' : '#f57c00';
  }};
`;

// vfs:components/RedirectTable.jsx
var RedirectTable = ({
  redirects,
  sortColumn,
  sortDirection,
  onSort,
  selectedIds,
  onSelectionChange,
  onView,
  onDelete,
}) => {
  const getSortIcon = (field) => {
    if (sortColumn !== field) return ' ↕';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };
  const handleSelectAll = () => {
    if (selectedIds.length === redirects.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(redirects.map((r) => r.id));
    }
  };
  const handleSelectRedirect = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };
  if (redirects.length === 0) {
    return React.createElement(
      EmptyState,
      null,
      React.createElement('h3', null, 'No redirect rules found'),
      React.createElement('p', null, 'Create your first redirect rule to get started')
    );
  }
  return React.createElement(
    TableContainer,
    null,
    React.createElement(
      Table,
      null,
      React.createElement(
        Table.Head,
        null,
        React.createElement(
          Table.HeaderRow,
          null,
          React.createElement(
            Table.HeaderCell,
            { width: '50px' },
            React.createElement(
              Checkbox,
              {
                checked: selectedIds.length === redirects.length && redirects.length > 0,
                indeterminate: selectedIds.length > 0 && selectedIds.length < redirects.length,
                onChange: handleSelectAll,
              },
              React.createElement(
                'span',
                {
                  style: { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' },
                },
                'Select all'
              )
            )
          ),
          React.createElement(
            Table.SortableCell,
            {
              onClick: () => onSort('redirect_from'),
              sort: sortColumn === 'redirect_from' ? sortDirection : void 0,
              width: '30%',
            },
            'Redirect From',
            getSortIcon('redirect_from')
          ),
          React.createElement(
            Table.SortableCell,
            {
              onClick: () => onSort('redirect_to'),
              sort: sortColumn === 'redirect_to' ? sortDirection : void 0,
              width: '30%',
            },
            'Redirect To',
            getSortIcon('redirect_to')
          ),
          React.createElement(
            Table.SortableCell,
            {
              onClick: () => onSort('redirect_status'),
              sort: sortColumn === 'redirect_status' ? sortDirection : void 0,
              width: '100px',
            },
            'Status',
            getSortIcon('redirect_status')
          ),
          React.createElement(
            Table.SortableCell,
            {
              onClick: () => onSort('created_at'),
              sort: sortColumn === 'created_at' ? sortDirection : void 0,
              width: '140px',
            },
            'Created',
            getSortIcon('created_at')
          ),
          React.createElement(Table.HeaderCell, { width: '180px' }, 'Actions')
        )
      ),
      React.createElement(
        Table.Body,
        null,
        redirects.map((redirect) =>
          React.createElement(
            Table.Row,
            { key: redirect.id, isSelected: selectedIds.includes(redirect.id) },
            React.createElement(
              Table.Cell,
              { width: '50px' },
              React.createElement(
                Checkbox,
                {
                  checked: selectedIds.includes(redirect.id),
                  onChange: () => handleSelectRedirect(redirect.id),
                },
                React.createElement(
                  'span',
                  {
                    style: {
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                    },
                  },
                  'Select redirect'
                )
              )
            ),
            React.createElement(
              Table.Cell,
              { title: redirect.redirect_from, width: '30%' },
              redirect.redirect_from
            ),
            React.createElement(
              Table.Cell,
              { title: redirect.redirect_to, width: '30%' },
              redirect.redirect_to
            ),
            React.createElement(
              Table.Cell,
              { width: '100px' },
              React.createElement(
                StatusBadge,
                { status: redirect.redirect_status },
                redirect.redirect_status
              )
            ),
            React.createElement(
              Table.Cell,
              { width: '140px' },
              new Date(redirect.created_at).toLocaleDateString()
            ),
            React.createElement(
              Table.Cell,
              { width: '180px' },
              React.createElement(
                Button,
                { size: 'small', onClick: () => onView(redirect), style: { marginRight: '8px' } },
                'View'
              ),
              React.createElement(
                Button,
                { size: 'small', isDanger: true, onClick: () => onDelete(redirect.id) },
                'Delete'
              )
            )
          )
        )
      )
    )
  );
};

// vfs:components/SearchBar.jsx
import React2 from 'react';
import { Field, Label, Input } from '@zendeskgarden/react-forms';

// vfs:styles/SearchBar.js
import styled2 from 'styled-components';
var SearchContainer = styled2.div`
        flex: 1;
        min-width: 250px;
        max-width: 400px;
      `;

// vfs:components/SearchBar.jsx
var SearchBar = ({ value, onChange, onSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  return React2.createElement(
    SearchContainer,
    null,
    React2.createElement(
      Field,
      null,
      React2.createElement(Label, null, 'Search by path'),
      React2.createElement(Input, {
        placeholder: 'Filter by redirect_from path...',
        value,
        onChange: (e) => onChange(e.target.value),
        onKeyPress: handleKeyPress,
      })
    )
  );
};

// vfs:components/CreateRedirectModal.jsx
import React3, { useState } from 'react';
import {
  Modal,
  Header,
  Body as ModalBody,
  Footer,
  FooterItem,
  Close as ModalClose,
} from '@zendeskgarden/react-modals';
import {
  Field as Field2,
  Label as Label2,
  Input as Input2,
  Select,
  Hint,
  Message,
} from '@zendeskgarden/react-forms';
import { Button as Button2 } from '@zendeskgarden/react-buttons';
import { Grid } from '@zendeskgarden/react-grid';
var CreateRedirectModal = ({ onClose, onCreate }) => {
  const [redirectFrom, setRedirectFrom] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [redirectStatus, setRedirectStatus] = useState('301');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const validateForm = () => {
    if (!redirectFrom.startsWith('/')) {
      setError('Redirect from path must start with "/"');
      return false;
    }
    if (
      !redirectTo.startsWith('https://') &&
      !redirectTo.startsWith('http://') &&
      !redirectTo.startsWith('/')
    ) {
      setError('Redirect to must start with "https://", "http://", or "/"');
      return false;
    }
    if (!['301', '302', '303', '307', '308'].includes(redirectStatus)) {
      setError('Invalid redirect status code');
      return false;
    }
    return true;
  };
  const handleSubmit = () =>
    __async(void 0, null, function* () {
      setError(null);
      if (!validateForm()) {
        return;
      }
      setLoading(true);
      try {
        yield onCreate({
          redirect_from: redirectFrom,
          redirect_to: redirectTo,
          redirect_status: redirectStatus,
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    });
  return React3.createElement(
    Modal,
    { onClose },
    React3.createElement(Header, null, 'Create Redirect Rule'),
    React3.createElement(
      ModalBody,
      null,
      React3.createElement(
        Grid,
        null,
        React3.createElement(
          Grid.Row,
          null,
          React3.createElement(
            Grid.Col,
            null,
            React3.createElement(
              Field2,
              null,
              React3.createElement(Label2, null, 'Redirect From'),
              React3.createElement(Hint, null, 'Path to redirect from. Must begin with "/"'),
              React3.createElement(Input2, {
                placeholder: '/hc/en-us/articles/123',
                value: redirectFrom,
                onChange: (e) => setRedirectFrom(e.target.value),
              })
            )
          )
        ),
        React3.createElement(
          Grid.Row,
          { style: { marginTop: '16px' } },
          React3.createElement(
            Grid.Col,
            null,
            React3.createElement(
              Field2,
              null,
              React3.createElement(Label2, null, 'Redirect To'),
              React3.createElement(
                Hint,
                null,
                'URL or path to redirect to. Must begin with "https://", "http://", or "/"'
              ),
              React3.createElement(Input2, {
                placeholder: 'https://example.com or /new-path',
                value: redirectTo,
                onChange: (e) => setRedirectTo(e.target.value),
              })
            )
          )
        ),
        React3.createElement(
          Grid.Row,
          { style: { marginTop: '16px' } },
          React3.createElement(
            Grid.Col,
            null,
            React3.createElement(
              Field2,
              null,
              React3.createElement(Label2, null, 'HTTP Status Code'),
              React3.createElement(Hint, null, 'The HTTP status to use when redirecting'),
              React3.createElement(
                Select,
                {
                  value: redirectStatus,
                  onChange: (e) => setRedirectStatus(e.target.value),
                },
                React3.createElement('option', { value: '301' }, '301 - Moved Permanently'),
                React3.createElement('option', { value: '302' }, '302 - Found (Temporary)'),
                React3.createElement('option', { value: '303' }, '303 - See Other'),
                React3.createElement('option', { value: '307' }, '307 - Temporary Redirect'),
                React3.createElement('option', { value: '308' }, '308 - Permanent Redirect')
              )
            )
          )
        ),
        error &&
          React3.createElement(
            Grid.Row,
            { style: { marginTop: '16px' } },
            React3.createElement(
              Grid.Col,
              null,
              React3.createElement(Message, { validation: 'error' }, error)
            )
          )
      )
    ),
    React3.createElement(
      Footer,
      null,
      React3.createElement(
        FooterItem,
        null,
        React3.createElement(Button2, { onClick: onClose, isBasic: true }, 'Cancel')
      ),
      React3.createElement(
        FooterItem,
        null,
        React3.createElement(
          Button2,
          { onClick: handleSubmit, isPrimary: true, disabled: loading },
          loading ? 'Creating...' : 'Create Redirect'
        )
      )
    ),
    React3.createElement(ModalClose, null)
  );
};

// vfs:components/DeleteConfirmModal.jsx
import React4, { useState as useState2 } from 'react';
import {
  Modal as Modal2,
  Header as Header2,
  Body as ModalBody2,
  Footer as Footer2,
  FooterItem as FooterItem2,
  Close as ModalClose2,
} from '@zendeskgarden/react-modals';
import { Button as Button3 } from '@zendeskgarden/react-buttons';
import {
  Field as Field3,
  Label as Label3,
  Input as Input3,
  Hint as Hint2,
} from '@zendeskgarden/react-forms';
var DeleteConfirmModal = ({ onClose, onConfirm, count, redirects }) => {
  const [confirmText, setConfirmText] = useState2('');
  const requiredText = 'DELETE';
  const isConfirmed = confirmText === requiredText;
  return React4.createElement(
    Modal2,
    { onClose },
    React4.createElement(Header2, null, 'Confirm Deletion'),
    React4.createElement(
      ModalBody2,
      null,
      React4.createElement(
        'p',
        { style: { marginBottom: '16px' } },
        'You are about to permanently delete ',
        count,
        ' redirect rule',
        count > 1 ? 's' : '',
        ':'
      ),
      React4.createElement(
        'ul',
        {
          style: {
            marginBottom: '16px',
            maxHeight: '120px',
            overflowY: 'auto',
            paddingLeft: '20px',
          },
        },
        redirects.map((redirect) =>
          React4.createElement(
            'li',
            { key: redirect.id, style: { marginBottom: '4px', fontSize: '14px' } },
            redirect.redirect_from,
            ' → ',
            redirect.redirect_to
          )
        )
      ),
      React4.createElement(
        'p',
        { style: { marginBottom: '16px', fontWeight: 600, color: '#cc3340' } },
        'This action cannot be undone.'
      ),
      React4.createElement(
        Field3,
        null,
        React4.createElement(Label3, null, 'Type DELETE to confirm'),
        React4.createElement(Hint2, null, 'You must type DELETE in all caps to proceed'),
        React4.createElement(Input3, {
          value: confirmText,
          onChange: (e) => setConfirmText(e.target.value),
          placeholder: 'Type DELETE here',
        })
      )
    ),
    React4.createElement(
      Footer2,
      null,
      React4.createElement(
        FooterItem2,
        null,
        React4.createElement(Button3, { onClick: onClose, isBasic: true }, 'Cancel')
      ),
      React4.createElement(
        FooterItem2,
        null,
        React4.createElement(
          Button3,
          { onClick: onConfirm, isDanger: true, disabled: !isConfirmed },
          'Delete Permanently'
        )
      )
    ),
    React4.createElement(ModalClose2, null)
  );
};

// vfs:components/ViewRedirectModal.jsx
import React5 from 'react';
import {
  Modal as Modal3,
  Header as Header3,
  Body as ModalBody3,
  Footer as Footer3,
  FooterItem as FooterItem3,
  Close as ModalClose3,
} from '@zendeskgarden/react-modals';
import { Button as Button4 } from '@zendeskgarden/react-buttons';
import { Well } from '@zendeskgarden/react-notifications';
import { Grid as Grid2 } from '@zendeskgarden/react-grid';

// vfs:styles/ViewRedirectModal.js
import styled3 from 'styled-components';
var DetailRow = styled3.div`
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      `;
var DetailLabel = styled3.strong`
        display: block;
        margin-bottom: 4px;
        font-weight: 600;
      `;
var DetailValue = styled3.div`
        word-break: break-all;
      `;

// vfs:components/ViewRedirectModal.jsx
var ViewRedirectModal = ({ redirect, onClose }) => {
  return React5.createElement(
    Modal3,
    { onClose },
    React5.createElement(Header3, null, 'Redirect Rule Details'),
    React5.createElement(
      ModalBody3,
      null,
      React5.createElement(
        Well,
        null,
        React5.createElement(
          Grid2,
          null,
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'ID:'),
                React5.createElement(DetailValue, null, redirect.id)
              )
            )
          ),
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'Redirect From:'),
                React5.createElement(DetailValue, null, redirect.redirect_from)
              )
            )
          ),
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'Redirect To:'),
                React5.createElement(DetailValue, null, redirect.redirect_to)
              )
            )
          ),
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'HTTP Status:'),
                React5.createElement(DetailValue, null, redirect.redirect_status)
              )
            )
          ),
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'Brand ID:'),
                React5.createElement(DetailValue, null, redirect.brand_id)
              )
            )
          ),
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'Created At:'),
                React5.createElement(
                  DetailValue,
                  null,
                  new Date(redirect.created_at).toLocaleString()
                )
              )
            )
          ),
          React5.createElement(
            Grid2.Row,
            null,
            React5.createElement(
              Grid2.Col,
              null,
              React5.createElement(
                DetailRow,
                null,
                React5.createElement(DetailLabel, null, 'Updated At:'),
                React5.createElement(
                  DetailValue,
                  null,
                  new Date(redirect.updated_at).toLocaleString()
                )
              )
            )
          )
        )
      )
    ),
    React5.createElement(
      Footer3,
      null,
      React5.createElement(
        FooterItem3,
        null,
        React5.createElement(Button4, { onClick: onClose, isPrimary: true }, 'Close')
      )
    ),
    React5.createElement(ModalClose3, null)
  );
};

// vfs:styles/RedirectManager.js
import styled4 from 'styled-components';
var AppContainer = styled4.div`
        padding: 24px;
        width: 100%;
        min-height: 100vh;
      `;
var HeaderSection = styled4.div`
        margin-bottom: 24px;
      `;
var Title = styled4.h1`
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 16px 0;
      `;
var ActionBar = styled4.div`
        display: flex;
        gap: 12px;
        align-items: flex-end;
        flex-wrap: wrap;
      `;

// vfs:components/RedirectManager.jsx
function RedirectManager() {
  const [redirects, setRedirects] = useState3([]);
  const [filteredRedirects, setFilteredRedirects] = useState3([]);
  const [loading, setLoading] = useState3(true);
  const [error, setError] = useState3(null);
  const [searchTerm, setSearchTerm] = useState3('');
  const [sortColumn, setSortColumn] = useState3('created_at');
  const [sortDirection, setSortDirection] = useState3('desc');
  const [selectedIds, setSelectedIds] = useState3([]);
  const [showCreateModal, setShowCreateModal] = useState3(false);
  const [showDeleteModal, setShowDeleteModal] = useState3(false);
  const [showViewModal, setShowViewModal] = useState3(false);
  const [deleteTarget, setDeleteTarget] = useState3(null);
  const [viewTarget, setViewTarget] = useState3(null);
  useEffect(() => {
    loadRedirects();
    window.zafClient.invoke('resize', { width: '100%', height: '600px' });
  }, []);
  useEffect(() => {
    filterAndSortRedirects();
  }, [redirects, searchTerm, sortColumn, sortDirection]);
  const loadRedirects = () =>
    __async(this, null, function* () {
      try {
        setLoading(true);
        setError(null);
        const response = yield window.zafClient.request({
          url: '/api/v2/guide/redirect_rules',
          type: 'GET',
        });
        setRedirects(response.redirect_rules || []);
      } catch (err) {
        setError('Failed to load redirect rules: ' + JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    });
  const filterAndSortRedirects = () => {
    let filtered = [...redirects];
    if (searchTerm) {
      filtered = filtered.filter((redirect) =>
        redirect.redirect_from.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      if (sortColumn === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    setFilteredRedirects(filtered);
  };
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const handleCreateRedirect = (redirectData) =>
    __async(this, null, function* () {
      try {
        yield window.zafClient.request({
          url: '/api/v2/guide/redirect_rules',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ redirect_rule: redirectData }),
        });
        setShowCreateModal(false);
        yield loadRedirects();
      } catch (err) {
        throw new Error('Failed to create redirect: ' + JSON.stringify(err));
      }
    });
  const handleDeleteRedirect = () =>
    __async(this, null, function* () {
      try {
        const idsToDelete = deleteTarget === 'bulk' ? selectedIds : [deleteTarget];
        yield Promise.all(
          idsToDelete.map((id) =>
            window.zafClient.request({
              url: `/api/v2/guide/redirect_rules/${id}`,
              type: 'DELETE',
            })
          )
        );
        setShowDeleteModal(false);
        setDeleteTarget(null);
        setSelectedIds([]);
        yield loadRedirects();
      } catch (err) {
        throw new Error('Failed to delete redirect: ' + JSON.stringify(err));
      }
    });
  const handleViewRedirect = (redirect) => {
    setViewTarget(redirect);
    setShowViewModal(true);
  };
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };
  const handleBulkDelete = () => {
    setDeleteTarget('bulk');
    setShowDeleteModal(true);
  };
  const getDeleteTargetRedirects = () => {
    if (deleteTarget === 'bulk') {
      return redirects.filter((r) => selectedIds.includes(r.id));
    }
    return redirects.filter((r) => r.id === deleteTarget);
  };
  if (loading) {
    return React6.createElement(
      AppContainer,
      null,
      React6.createElement(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          },
        },
        React6.createElement(Inline, null)
      )
    );
  }
  return React6.createElement(
    AppContainer,
    null,
    React6.createElement(
      HeaderSection,
      null,
      React6.createElement(Title, null, 'Help Center Redirect Manager'),
      error &&
        React6.createElement(
          Alert,
          { type: 'error' },
          React6.createElement(AlertTitle, null, 'Error'),
          error
        )
    ),
    React6.createElement(
      ActionBar,
      null,
      React6.createElement(SearchBar, { value: searchTerm, onChange: setSearchTerm }),
      React6.createElement(
        Button5,
        { isPrimary: true, onClick: () => setShowCreateModal(true) },
        'Create Redirect'
      ),
      selectedIds.length > 0 &&
        React6.createElement(
          Button5,
          { isDanger: true, onClick: handleBulkDelete },
          'Delete Selected (',
          selectedIds.length,
          ')'
        )
    ),
    React6.createElement(
      'div',
      { style: { marginTop: '24px' } },
      React6.createElement(RedirectTable, {
        redirects: filteredRedirects,
        sortColumn,
        sortDirection,
        onSort: handleSort,
        selectedIds,
        onSelectionChange: setSelectedIds,
        onView: handleViewRedirect,
        onDelete: handleDeleteClick,
      })
    ),
    showCreateModal &&
      React6.createElement(CreateRedirectModal, {
        onClose: () => setShowCreateModal(false),
        onCreate: handleCreateRedirect,
      }),
    showDeleteModal &&
      React6.createElement(DeleteConfirmModal, {
        redirects: getDeleteTargetRedirects(),
        onClose: () => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        },
        onConfirm: handleDeleteRedirect,
      }),
    showViewModal &&
      viewTarget &&
      React6.createElement(ViewRedirectModal, {
        redirect: viewTarget,
        onClose: () => {
          setShowViewModal(false);
          setViewTarget(null);
        },
      })
  );
}

// vfs:index.jsx
var queryParams = new URLSearchParams(location.search);
var initialColorScheme = queryParams.get('colorScheme') || 'light';
var App = () => {
  const [base, setBase] = useState4(initialColorScheme);
  useEffect2(() => {
    window.zafClient.get('colorScheme').then((data) => setBase(data.colorScheme));
    window.zafClient.on('colorScheme.changed', (colorScheme) => setBase(colorScheme));
    window.zafClient.invoke('resize', { width: '100%', height: '100%' });
  }, []);
  const themeObject = __spreadProps(__spreadValues({}, DEFAULT_THEME), {
    colors: __spreadProps(__spreadValues({}, DEFAULT_THEME.colors), { base }),
  });
  return React7.createElement(
    ThemeProvider,
    { theme: themeObject },
    React7.createElement(RedirectManager, null)
  );
};
var index_default = App;
var ErrorBoundary = class extends React7.Component {
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
      return React7.createElement(
        'div',
        {
          style: {
            fontSize: '16px',
            display: 'grid',
            padding: '20px',
          },
        },
        React7.createElement(
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
          React7.createElement(
            'h4',
            {
              style: {
                marginBottom: '8px',
                color: '#d93f4c',
              },
            },
            'An error occurred in your application'
          ),
          React7.createElement(
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
          React7.createElement(
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
              ? React7.createElement(
                  React7.Fragment,
                  null,
                  React7.createElement('span', { style: { color: '#1f73b7' } }, 'Copied!')
                )
              : React7.createElement(React7.Fragment, null, 'Copy error')
          ),
          React7.createElement(
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
  React7.createElement(ErrorBoundary, null, React7.createElement(App, null));
try {
  createRoot(document.getElementById('root')).render(
    React7.createElement(AppWithErrorBoundary, null)
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
