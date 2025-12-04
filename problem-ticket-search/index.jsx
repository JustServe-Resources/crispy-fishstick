import React, { useState, useEffect } from 'react';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';
import { SearchContainer } from './components/SearchContainer';

const queryParams = new URLSearchParams(location.search);
const initialColorScheme = queryParams.get('colorScheme') || 'light';

const App = () => {
  const [base, setBase] = useState(initialColorScheme);

  useEffect(() => {
    window.zafClient.get('colorScheme').then((data) => setBase(data.colorScheme));
    window.zafClient.on('colorScheme.changed', (colorScheme) => setBase(colorScheme));
    window.zafClient.invoke('resize', { width: '700px', height: '600px' });
  }, []);

  const themeObject = {
    ...DEFAULT_THEME,
    colors: { ...DEFAULT_THEME.colors, base },
  };

  return (
    <ThemeProvider theme={themeObject}>
      <SearchContainer />
    </ThemeProvider>
  );
};

export default App;
