import React from "react";
import Overview from "../charts/Overview";
import TopicsView from "../charts/TopicsView";
import OverallUserAgentComparison from "../charts/OverallUserAgentComparison";
import WeekDayCounts from "../charts/WeekdayCounts";

const GeneralViews = () => {
  return (
    <>
      <Overview />
      <TopicsView />
      <OverallUserAgentComparison />
      <WeekDayCounts />
    </>
  );
};
export default GeneralViews;
