import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";

const TopicsByWeek = () => {
  const [chartData, setdata] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);

  const getQuery = async () => {
    let query = {
      query: {
        bool: {
          must: [
            {
              term: {
                topics: {
                  value: "music",
                },
              },
            },
          ],
        },
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
    };
    if (countryFilter !== "Global") {
      query = {
        query: {
          bool: {
            must: [
              {
                term: {
                  country: {
                    value: countryFilter,
                  },
                },
              },
              {
                term: {
                  topics: {
                    value: "music",
                  },
                },
              },
            ],
          },
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
      };
    }

    const res = await getWithQuery(query);
    let resAgg = {};
    console.log(res)
    resAgg = res.aggregations.daysOfWeek.buckets;
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].doc_count;
    });
    setdata(resArray);
  };

  useEffect(() => {
    getQuery();
  }, [countryFilter]);

  return chartData.length > 0 ? (
    <div>
      <ReactEcharts
        option={{
          grid: {
            containLabel: true,
          },
          title: {
            text: "# requests per topic and days of week (topic: music)",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          xAxis: {
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            name: "Days of the week",
            nameLocation: "middle",
            nameGap: "30",
          },
          yAxis: {
            type: "value",
            name: "# of requests",
            nameLocation: "middle",
            nameGap: "90",
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

export default TopicsByWeek;
