import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import GetData from './components/GetData';
import theme from './Theme';

const isProd = process.env.REACT_APP_PROD;

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (th) => th.zIndex.drawer + 1 }} color="primary">
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Elastic-RSI
            </Typography>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
            <Typography>RSI + Elastic = wow</Typography>
            <GetData />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
