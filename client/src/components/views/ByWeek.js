import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
import DevicesByWeek from "../charts/DevicesByWeek";
import TopicsByWeek from "../charts/TopicsByWeek";
import WeekDayComparison from "../charts/WeekDayComparison";

const ByWeek = () => {
  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <CountsPerDayOfWeek />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <TopicsByWeek />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <DevicesByWeek />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <WeekDayComparison />
      </div>
    </>
  );
};
export default ByWeek;
