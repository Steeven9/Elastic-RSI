import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
import TopicsPerDayOfWeek from "../charts/TopicsView";
import WeekDayComparison from '../charts/WeekDayComparison'

const ByWeek = () => {
  return (
    <>
      <CountsPerDayOfWeek />
      <TopicsPerDayOfWeek />
      <WeekDayComparison />
    </>
  );
};
export default ByWeek;
