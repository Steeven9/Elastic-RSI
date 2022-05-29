import { Grid } from "@mui/material";
import React from "react";
import DeviceGraph from "../charts/DeviceGraph";
import OverallUserAgentComparison from "../charts/OverallUserAgentComparison";
import Overview from "../charts/Overview";
import TopicGraph from "../charts/TopicGraph";
import TopicsView from "../charts/TopicsView";

const GeneralViews = () => {
  return (
    <>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={6} md={5}>
          <DeviceGraph />
        </Grid>
        <Grid item xs={6} md={5}>
          <TopicGraph />
        </Grid>
      </Grid>

      <Overview />
      <TopicsView />
      <OverallUserAgentComparison />
    </>
  );
};
export default GeneralViews;
