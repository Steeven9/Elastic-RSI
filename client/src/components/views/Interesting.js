import React from "react";
import TopicIdentification from "../charts/TopicIdentification";
import UnknownCountries from "../charts/UnknownCountries";
import WeekDayCounts from "../charts/WeekDayCounts";

const Interesting = () => {
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <TopicIdentification />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <UnknownCountries />
      </div>
      <div style={{
        marginBottom: "20px",
        width: "40%",
        margin: "auto"
      }}>
        <WeekDayCounts />
      </div>
    </>
  );
};
export default Interesting;
