import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
import TopicsByWeek from "../charts/TopicsByWeek";
import WeekDayComparison from "../charts/WeekDayComparison";

const ByWeek = () => {
  return (
    <>
      <TopicsByWeek />
      <CountsPerDayOfWeek />
      <WeekDayComparison />
    </>
  );
};
export default ByWeek;
