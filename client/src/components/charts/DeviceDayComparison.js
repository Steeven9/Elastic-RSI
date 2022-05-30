import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";
import Loading from "../Loading";

function dateToHourIndex(date) {
  return date.getHours();
}

function getDevices() {
  return ["desktop", "smartphone", "tablet", "tv", "portable media player"];
}

const DeviceDayComparison = () => {
  const [data, setData] = useState(undefined);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

  const fetchData = async () => {
    let result = new Array(getDevices().length);
    await Promise.all(
      getDevices().map(async (device, i) => {
        const query = buildQuery(
          {
            country: countryFilter,
            admin1: regionFilter,
            user_agent: [device],
          },
          {
            aggs: {
              by_hour: {
                date_histogram: {
                  field: "ch_date",
                  calendar_interval: "hour",
                },
              },
            },
            sort: [
              {
                ch_date: {
                  order: "asc",
                },
              },
            ],
          }
        );
        const response = await getWithQuery(query);
        let values = new Array(24).fill(0);
        const numberHours = response.aggregations.by_hour.buckets.length;
        if (numberHours > 0) {
          const startDate = new Date(
            response.aggregations.by_hour.buckets[0].key_as_string
          );
          let hourIndex = dateToHourIndex(startDate);
          let hourCounter = new Array(24).fill(0);
          for (let i = 0; i < numberHours; i++) {
            values[hourIndex] +=
              response.aggregations.by_hour.buckets[i].doc_count;
            hourCounter[hourIndex] += 1;
            hourIndex = (hourIndex + 1) % 24;
          }
          for (let i = 0; i < hourCounter.length; i++) {
            values[i] = values[i] / hourCounter[i];
          }
        }
        result[i] = {
          device: device,
          counts: values,
        };
      })
    );
    setData(result);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryFilter, regionFilter]);

  return (
    <div
      style={{
        aspectRatio: 2 / 1,
      }}
    >
      {data ? (
        <ReactEcharts
          option={{
            grid: {
              left: "10%",
              right: "12.5%",
              containLabel: true,
            },
            title: {
              text: "Comparison of daily course of number of requests between device types",
              left: "center",
            },
            legend: {
              orient: "vertical",
              right: "0%",
              top: "middle",
            },
            tooltip: {
              trigger: "item",
            },
            xAxis: {
              name: "Day time",
              nameLocation: "middle",
              nameGap: 30,
              nameTextStyle: {
                fontSize: 14,
                fontWeight: "bolder",
              },
              axisLabel: {
                interval: 2,
              },
              type: "category",
              data: new Array(24)
                .fill(0)
                .map((_, i) => `${new String(i).padStart(2, "0")}:00`),
            },
            yAxis: {
              name: "Number of requests",
              nameLocation: "middle",
              nameGap: 70,
              nameTextStyle: {
                fontSize: 14,
                fontWeight: "bolder",
              },
              type: "value",
            },
            series: getDevices().map((deviceName, deviceIndex) => {
              return {
                name: deviceName,
                type: "line",
                tooltip: {
                  formatter: (params) =>
                    `Device: ${params.seriesName} </br>Number of requests: ${
                      params.value.toFixed(1)
                    } </br>Day time: ${params.name} - ${(
                      parseInt(params.name.split(":")[0]) + 1
                    )
                      .toString()
                      .padStart(2, "0")}:00`,
                  extraCssText: "box-shadow: 0 0 0 rgba(0, 0, 0, 0);",
                },
                symbolSize: 4,
                symbol: "circle",
                lineStyle: {
                  width: 1.5,
                },
                data: data[deviceIndex].counts,
              };
            }),
          }}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DeviceDayComparison;
