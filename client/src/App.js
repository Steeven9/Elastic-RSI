import MenuIcon from "@mui/icons-material/Menu";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions";
import AppDrawer from "./components/AppDrawer";
import ChartTabs from "./components/ChartTabs";
import theme from "./Theme";
import GeneralActions from "./components/GeneralActions";

const App = (props) => {
  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const dispatch = useDispatch();
  const [filterOpen, setFilterOpen] = useState(true);
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
            <Typography noWrap sx={{ flexGrow: 1 }} component="div">
              RSI + Elastic = wow
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open filter"
              edge="end"
              onClick={() => setFilterOpen(true)}
              sx={{ ...(filterOpen && { display: "none" }) }}
            >
              <FilterAltIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: 300 }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            ModalProps={{
              // Better open performance on mobile.
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 300 },
            }}
          >
            <GeneralActions />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 300 },
            }}
            open
          >
            <GeneralActions />
          </Drawer>
        </Box>
        <div style={{ width: "100%", padding: "10px" }}>
          <AppDrawer />
          <Box component="main">
            <Toolbar />
            <ChartTabs />
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default App;
