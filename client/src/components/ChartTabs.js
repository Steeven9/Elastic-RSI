import { useSelector } from "react-redux";
import CountsPerDayOfWeek from "./charts/CountsPerDayOfWeek";
import GetData from "./charts/GetData";
import HomeMaps from "./charts/HomeMaps";

const ChartTabs = () => {
  const tab = useSelector((st) => st.generalReducer.tab);

  const renderTabs = () => {
    switch (tab) {
      case "home":
        return <HomeMaps />;
      case "byWeek":
        return <CountsPerDayOfWeek />;
      case "byDay":
        return <GetData />;
      default:
        return <GetData />;
    }
  };

  return <>{renderTabs()}</>;
};

export default ChartTabs;
