import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";

const CountsPerDayOfWeek = () => {
  const [chartData, setdata] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

  const getQuery = async () => {
    const isCountrySelected = countryFilter.length > 0;
    const isRegionSelected = regionFilter.length > 0;
    
    const query = {
      ...(isCountrySelected || isRegionSelected 
        ? {
            query: {
              bool: {
                must: [
                  ...(isCountrySelected
                    ? [
                        {
                          terms: {
                            country: countryFilter,
                          },
                        },
                      ]
                    : []),
                  ...(isRegionSelected
                    ? [
                        {
                          terms: {
                            admin1: regionFilter,
                          },
                        },
                      ]
                    : []),
                ],
              },
            },
          }
        : {}),
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

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.daysOfWeek.buckets;
    
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].doc_count;
    });
    setdata(resArray);
  };

  useEffect(() => {
    getQuery();
  }, [countryFilter, regionFilter]);

  return chartData.length > 0 ? (
    <div>
      <ReactEcharts
        option={{
          grid: {
            containLabel: true,
          },
          title: {
            text: "# requests per days of week",
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

export default CountsPerDayOfWeek;
