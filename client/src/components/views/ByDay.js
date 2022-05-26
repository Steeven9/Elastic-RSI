import React from "react";
import DayTimesComparison from "../charts/DayTimesComparison";
import Overview from "../charts/Overview";
import DeviceDayComparison from "../charts/DeviceDayComparison";

const ByDay = () => {
  return (
    <>
      <Overview />
      <DayTimesComparison />
      <DeviceDayComparison />
    </>
  );
};
export default ByDay;
