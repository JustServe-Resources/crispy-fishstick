import React from 'react';
import { Table } from '@zendeskgarden/react-tables';
import { Spinner } from '@zendeskgarden/react-loaders';
import { ResultsWrapper, EmptyState, LoadingWrapper, SubjectLink } from '../styles/ResultsTable';

export const ResultsTable = ({ results, loading, hasSearched }) => {
  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );
  }

  if (!hasSearched) {
    return <EmptyState>Enter a search term to find problem tickets</EmptyState>;
  }

  if (results.length === 0) {
    return <EmptyState>No problem tickets found</EmptyState>;
  }

  const openTicket = (ticketId) => {
    window.zafClient.invoke('routeTo', 'ticket', ticketId);
  };

  return (
    <ResultsWrapper>
      <Table size="small">
        <Table.Head>
          <Table.HeaderRow>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell width="100px">Status</Table.HeaderCell>
          </Table.HeaderRow>
        </Table.Head>
        <Table.Body>
          {results.map((ticket) => (
            <Table.Row key={ticket.id}>
              <Table.Cell>
                <SubjectLink onClick={() => openTicket(ticket.id)}>
                  {ticket.subject || 'No subject'}
                </SubjectLink>
              </Table.Cell>
              <Table.Cell>{ticket.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ResultsWrapper>
  );
};
