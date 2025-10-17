'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export function Providers({ children }: { children: React.ReactNode }) {
  
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#2b6cb0' },
      secondary: { main: '#d53f8c' },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h4: { fontWeight: 700 },
    },
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
