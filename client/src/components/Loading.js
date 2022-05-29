import { CircularProgress, Typography } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography sx={{ margin: "20px" }}>Loading...</Typography>
      <CircularProgress />
    </div>
  );
};

export default Loading;
