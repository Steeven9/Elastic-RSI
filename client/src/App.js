import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions";
import AppDrawer from "./components/AppDrawer";
import ChartTabs from "./components/ChartTabs";
import GeneralActions from "./components/GeneralActions";
import theme from "./Theme";

const isProd = process.env.REACT_APP_PROD;

const App = () => {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((st) => st.generalReducer.drawer);

  const setDrawerOpen = useCallback(
    (data) => {
      dispatch(actions.setDrawer(data));
    },
    [dispatch]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (th) => th.zIndex.drawer + 1 }}
          color="primary"
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
            <img
              src={"/img/logoRsi_clean.png"}
              alt="logo"
              style={{ width: "50px", margin: "0 10px" }}
            />
            <Typography>RSI + Elastic = wow</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ width: "100%", padding: "10px" }}>
          <AppDrawer />
          <Box component="main">
            <Toolbar />
            <div>
              <GeneralActions />
            </div>
            <ChartTabs />
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default App;
