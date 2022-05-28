import React from "react";
import Overview from "../charts/Overview";
import TopicsView from "../charts/TopicsView";
import OverallUserAgentComparison from "../charts/OverallUserAgentComparison";
import WeekDayCounts from "../charts/WeekdayCounts";
import DeviceGraph from "../charts/DeviceGraph";
import TopicGraph from "../charts/TopicGraph";
import { Grid } from "@mui/material";

const GeneralViews = () => {
  return (
    <>
      <Grid container justifyContent={"space-evenly"}>
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
      <WeekDayCounts />
    </>
  );
};
export default GeneralViews;
