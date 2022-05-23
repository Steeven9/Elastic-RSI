import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
import TopicsByWeek from "../charts/TopicsByWeek";

const ByWeek = () => {
  return (
    <>
      <CountsPerDayOfWeek />
      <TopicsByWeek />
    </>
  );
};
export default ByWeek;
