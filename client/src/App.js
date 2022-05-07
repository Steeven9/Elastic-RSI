import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SocketContext from './SocketContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';

const isProd = process.env.REACT_APP_PROD;

const App = () => {
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    console.info('Connecting to ' + (isProd ? 'prod' : 'dev'));
    const newSocket = isProd
      ? io.connect({ path: '/socket.io' })
      : io.connect(`http://${window.location.hostname}:4000`, {
          path: '/socket.io',
        });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

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
          <SocketContext.Provider value={socket}>
            <Typography>RSI + Elastic = wow</Typography>
          </SocketContext.Provider>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
