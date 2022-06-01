import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";
import Loading from "../Loading";

function dateToWeekDayIndex(date) {
  const index = date.getDay();
  return (index + 6) % 7;
}

function dateToHourIndex(date) {
  return date.getHours();
}

function getWeekDays() {
  return [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
}

const WeekDayComparison = () => {
  const [option, setOption] = useState(undefined);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const getData = async () => {
    const query = buildQuery(
      {
        country: countryFilter,
        admin1: regionFilter,
        topics: topicFilter,
        user_agent: deviceFilter,
      },
      {
        aggs: {
          by_hour: {
            date_histogram: {
              field: "local_date",
              calendar_interval: "hour",
            },
          },
        },
        sort: [
          {
            local_date: {
              order: "asc",
            },
          },
        ],
      }
    );
    const response = await getWithQuery(query);
    let values = new Array(7 * 24).fill(0);
    const numberHours = response.aggregations.by_hour.buckets.length;
    if (numberHours > 0) {
      const startDate = new Date(
        response.aggregations.by_hour.buckets[0].key_as_string
      );
      const startWeekDayIndex = dateToWeekDayIndex(startDate);
      const startHourIndex = dateToHourIndex(startDate);
      let hourIndex = 24 * startWeekDayIndex + startHourIndex;
      let hourCounter = new Array(7 * 24).fill(0);
      for (let i = 0; i < numberHours; i++) {
        values[hourIndex] += response.aggregations.by_hour.buckets[i].doc_count;
        hourCounter[hourIndex] += 1;
        hourIndex = (hourIndex + 1) % (7 * 24);
      }
      for (let i = 0; i < hourCounter.length; i++) {
        values[i] /= hourCounter[i];
      }
    }
    const option = {
      grid: {
        left: "10%",
        right: "10%",
        containLabel: true,
      },
      title: {
        text: "Comparison of daily course of number of requests between weekdays",
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
        boundaryGap: false,
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
      series: getWeekDays().map((dayName, dayIndex) => {
        return {
          name: dayName,
          type: "line",
          tooltip: {
            formatter: (params) =>
              `Day: ${
                params.seriesName
              } </br>Number of requests: ${params.value.toFixed(
                1
              )} </br>Day time: ${params.name} - ${(
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
          data: values.slice(dayIndex * 24, dayIndex * 24 + 24),
        };
      }),
    };
    setOption(option);
  };

  useEffect(
    () => getData(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryFilter, regionFilter, topicFilter, deviceFilter]
  );

  return (
    <div
      style={{
        aspectRatio: 2 / 1,
      }}
    >
      {option ? <ReactEcharts option={option} /> : <Loading />}
    </div>
  );
};

export default WeekDayComparison;
