import React from "react";
import { useSelector } from "react-redux";
import GeneralActions from "./GeneralActions";
import ByDay from "./views/ByDay";
import ByWeek from "./views/ByWeek";
import GeneralViews from "./views/GeneralViews";
import Home from "./views/Home";

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
            <ByDay />
          </>
        );
    }
  };

  return <>{renderTabs()}</>;
};

export default ChartTabs;
