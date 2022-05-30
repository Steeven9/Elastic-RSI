import React from "react";
import DayTimesComparison from "../charts/DayTimesComparison";
import DeviceDayComparison from "../charts/DeviceDayComparison";

const ByDay = () => {
  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <DayTimesComparison />
      </div>
      <div style={{ marginBottom: "0px" }}>
        <DeviceDayComparison />
      </div>
    </>
  );
};
export default ByDay;
