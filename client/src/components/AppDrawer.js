import { Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";

const AppDrawer = () => {
  const dispatch = useDispatch();

  const drawerOpen = useSelector((st) => st.generalReducer.drawer);
  const setDrawerOpen = useCallback(
    (data) => {
      dispatch(actions.setDrawer(data));
    },
    [dispatch]
  );

  const setTab = useCallback(
    (data) => {
      dispatch(actions.setTab(data));
    },
    [dispatch]
  );

  const menuItems = [
    { name: "Home", key: "home" },
    {
      name: "Days of Week",
      key: "dayOfWeek",
    },
  ];

  const setPage = (tab) => {
    setDrawerOpen(false);
    setTab(tab);
  };

  const list = () => (
    <Box
      sx={{ width: 250, overflow: "auto" }}
      variant="permanent"
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton onClick={() => setPage(item.key)}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Toolbar />
      {list()}
    </Drawer>
  );
};

export default AppDrawer;
