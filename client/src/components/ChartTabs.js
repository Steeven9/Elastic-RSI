import React from "react";
import { useSelector } from "react-redux";
import ByDay from "./views/ByDay";
import ByWeek from "./views/ByWeek";
import GeneralViews from "./views/GeneralViews";
import Home from "./views/Home";
import Switzerland from "./views/Switzerland";
import Interesting from "./views/Interesting";

const ChartTabs = () => {
  const tab = useSelector((st) => st.generalReducer.tab);

  const renderTabs = () => {
    switch (tab) {
      case "global":
        return <Home />;
      case "switzerland":
        return <Switzerland />;
      case "general":
        return <GeneralViews />;
      case "byWeek":
        return <ByWeek />;
      case "byDay":
        return <ByDay />;
      case "interesting":
        return <Interesting />;
      default:
        return <ByDay />;
    }
  };

  return <>{renderTabs()}</>;
};

export default ChartTabs;
