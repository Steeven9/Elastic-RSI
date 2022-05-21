import { useSelector } from "react-redux";
import GetData from "./charts/GetData";
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
        return <GeneralViews />;
      case "byWeek":
        return <ByWeek />;
      case "byDay":
        return <GetData />;
      default:
        return <GetData />;
    }
  };

  return <>{renderTabs()}</>;
};

export default ChartTabs;
