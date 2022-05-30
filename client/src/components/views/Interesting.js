import React from "react";
import TopicIdentification from "../charts/TopicIdentification";
import UnknownCountries from "../charts/UnknownCountries";

const Interesting = () => {
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <TopicIdentification />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <UnknownCountries />
      </div>
    </>
  );
};
export default Interesting;
