import React from "react";
import { useSelector } from "react-redux";
import GetData from "./charts/GetData";
import ByWeek from "./views/ByWeek";
import GeneralViews from "./views/GeneralViews";
import Home from "./views/Home";
import GeneralActions from "./GeneralActions";

const ChartTabs = () => {
  const tab = useSelector((st) => st.generalReducer.tab);

  const renderTabs = () => {
    switch (tab) {
      case "home":
        return <Home />;
      case "general":
        return (
          <>
            <GeneralActions />
            <GeneralViews />
          </>
        );
      case "byWeek":
        return (
          <>
            <GeneralActions />
            <ByWeek />
          </>
        );
      case "byDay":
      default:
        return (
          <>
            <GeneralActions />
            <GetData />
          </>
        );
    }
  };

  return <>{renderTabs()}</>;
};

export default ChartTabs;
