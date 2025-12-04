import React, { useState } from 'react';
import { Field, Label, Input, InputGroup } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';
import { ResultsTable } from './ResultsTable';
import { AppWrapper, SearchSection, SearchRow } from '../styles/SearchContainer';

export const SearchContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await window.zafClient.request({
        url: '/api/v2/search.json',
        type: 'GET',
        data: {
          query: `type:ticket ticket_type:problem ${searchQuery}`,
          sort_by: 'created_at',
          sort_order: 'desc'
        }
      });

      setResults(response.results || []);
    } catch (err) {
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppWrapper>
      <SearchSection>
        <Field>
          <Label>Search Problem Tickets</Label>
          <InputGroup>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter keywords to search subject and comments..."
            />
          </InputGroup>
        </Field>
        <SearchRow>
          <Button onClick={handleSearch} isPrimary disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </SearchRow>
      </SearchSection>

      {error && <div style={{ color: 'red', padding: '12px' }}>{error}</div>}

      <ResultsTable results={results} loading={loading} hasSearched={hasSearched} />
    </AppWrapper>
  );
};
