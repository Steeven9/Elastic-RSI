import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
import TopicsByWeek from "../charts/TopicsByWeek";
import WeekDayComparison from "../charts/WeekDayComparison";
import WeekDayCounts from "../charts/WeekdayCounts";

const ByWeek = () => {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateAreas: `'chart1 table' 'chart2 table`,
          gridTemplateColumns: "75% 25%",
        }}
      >
        <div style={{ gridArea: "chart1" }}>
          <CountsPerDayOfWeek />
        </div>
        <div style={{ gridArea: "chart2" }}>
          <TopicsByWeek />
        </div>
        <div style={{ gridArea: "table" }}>
          <WeekDayCounts />
        </div>
      </div>
      <WeekDayComparison />
    </>
  );
};
export default ByWeek;
