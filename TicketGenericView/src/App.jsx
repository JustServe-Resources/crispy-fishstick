import React, { useState, useEffect } from 'react';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';
import { TicketOverview } from './components/TicketOverview';
import { AppContainer } from './styles/AppStyles';

const App = () => {
  const [ticketData, setTicketData] = useState(null);
  const [ticketFields, setTicketFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const fetchTicketData = async () => {
    try {
      console.log('Fetching ticket data...');
      const data = await window.zafClient.get([
        'ticket.id',
        'ticket.subject',
        'ticket.status',
        'ticket.priority',
        'ticket.type',
        'ticket.tags',
        'ticket.requester',
        'ticket.assignee',
        'ticket.description',
        'ticket.conversation',
        'ticket.customField:custom_field_37453127421979',
        'ticket.customField:custom_field_38720689571483',
        'ticketFields'
      ]);

      console.log('Fetched ticket data:', data);
      setTicketData(data);
      setTicketFields(data.ticketFields || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ticket data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await window.zafClient.invoke('resize', { width: '100%', height: '600px' });

        const colorSchemeData = await window.zafClient.get('colorScheme');
        setIsDark(colorSchemeData.colorScheme === 'dark');

        await fetchTicketData();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setLoading(false);
      }
    };

    if (window.zafClient) {
      initializeApp();
    }
  }, []);

  const handleRefresh = async () => {
    console.log('Refreshing ticket data...');
    setLoading(true);
    await fetchTicketData();
  };

  const theme = {
    ...DEFAULT_THEME,
    colors: {
      ...DEFAULT_THEME.colors,
      base: isDark ? 'dark' : 'light'
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <TicketOverview 
          ticketData={ticketData}
          ticketFields={ticketFields}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
