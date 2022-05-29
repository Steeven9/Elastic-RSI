import React from "react";
import TopicIdentification from "../charts/TopicIdentification";
import UnknownCountries from "../charts/UnknownCountries";

const Interesting = () => {
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <TopicIdentification />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <UnknownCountries />
      </div>
    </>
  );
};
export default Interesting;
