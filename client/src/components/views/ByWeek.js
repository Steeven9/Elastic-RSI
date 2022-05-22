import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
import TopicsPerDayOfWeek from "../charts/TopicsView";

const ByWeek = () => {
  return (
    <>
      <CountsPerDayOfWeek />
      <TopicsPerDayOfWeek />
    </>
  );
};
export default ByWeek;
