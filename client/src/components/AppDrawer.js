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

  const list = () => (
    <Box
      sx={{ width: 250, overflow: "auto" }}
      variant="permanent"
      onClick={() => setDrawerOpen(false)}
    >
      <List>
        {["BarCharts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
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
