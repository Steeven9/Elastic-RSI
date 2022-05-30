import React from "react";
import CountsPerDayOfWeek from "../charts/CountsPerDayOfWeek";
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
        <WeekDayComparison />
      </div>
    </>
  );
};
export default ByWeek;

/**
 
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

 */
