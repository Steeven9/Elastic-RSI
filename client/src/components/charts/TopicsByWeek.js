import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";

const TopicsByWeek = () => {
  const [chartData, setData] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const getQuery = async () => {
    const queryTopics = {};
    topicFilter.forEach((topic) => {
      queryTopics[topic] = { match: { topics: topic } };
    });

    const query = buildQuery(
      {
        country: countryFilter,
        admin1: regionFilter,
        user_agent: deviceFilter,
      },
      {
        aggs: {
          topicsByWeek: {
            filters: {
              filters: queryTopics,
            },
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
          },
        },
      }
    );

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.topicsByWeek.buckets;

    const resArray = Object.keys(resAgg).map((topic) => {
      const data = Object.keys(resAgg[topic].daysOfWeek.buckets).map((day) => {
        return resAgg[topic].daysOfWeek.buckets[day].doc_count;
      });

      return {
        name: topic,
        type: "bar",
        barGap: 0,
        emphasis: {
          focus: "series",
        },
        data: data,
      };
    });

    setData(resArray);
  };

  useEffect(() => {
    if (topicFilter.length > 0) getQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryFilter, regionFilter, topicFilter, deviceFilter]);

  return (
    <>
      {chartData.length > 0 ? (
        <div>
          <ReactEcharts
            option={{
              title: {
                text: "Number of requests per topic and weekday",
                left: "center",
                top: 20,
              },
              legend: {
                data: topicFilter,
                top: 0,
                right: 100,
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
                }
              },
              yAxis: {
                type: "value",
                name: "Number of requests",
                nameLocation: "middle",
                nameGap: "90",
                nameTextStyle: {
                  fontSize: 14,
                  fontWeight: "bolder",
                }
              },
              series: chartData,
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default TopicsByWeek;
