import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";

const CountsPerDayOfWeek = () => {
  const [chartData, setdata] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const getQuery = async () => {
    const query = buildQuery(
      {
        country: countryFilter,
        admin1: regionFilter,
        topics: topicFilter,
        user_agent: deviceFilter,
      },
      {
        aggs: {
          daysOfWeek: {
            filters: {
              filters: {
                1: { match: { day_of_week: "1" } },
                2: { match: { day_of_week: "2" } },
                3: { match: { day_of_week: "3" } },
                4: { match: { day_of_week: "4" } },
                5: { match: { day_of_week: "5" } },
                6: { match: { day_of_week: "6" } },
                7: { match: { day_of_week: "7" } },
              },
            },
          },
        },
      }
    );

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.daysOfWeek.buckets;

    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].doc_count;
    });
    setdata(resArray);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getQuery(), [countryFilter, regionFilter]);

  return chartData.length > 0 ? (
    <div>
      <ReactEcharts
        option={{
          grid: {
            containLabel: true,
          },
          title: {
            text: "Number of requests per weekday",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          xAxis: {
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            name: "Weekday",
            nameLocation: "middle",
            nameGap: "30",
            nameTextStyle: {
              fontSize: 14,
              fontWeight: "bolder",
            },
          },
          yAxis: {
            type: "value",
            name: "Number of requests",
            nameLocation: "middle",
            nameGap: "90",
            nameTextStyle: {
              fontSize: 14,
              fontWeight: "bolder",
            },
          },
          series: [
            {
              type: "bar",
              large: true,
              data: chartData,
              barWidth: "90%",
            },
          ],
        }}
      />
    </div>
  ) : null;
};

export default CountsPerDayOfWeek;
