import ReactEcharts from "echarts-for-react";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";
import Loading from "../Loading";

function mapHourToDayTime(hour) {
  if (6 < hour && hour <= 12) {
    return "morning";
  } else if (12 < hour && hour <= 18) {
    return "afternoon";
  } else if (18 < hour && hour <= 24) {
    return "evening";
  } else {
    return "night";
  }
}

function mapDayTimeToTimeRange(dayTime) {
  if (dayTime === "morning") {
    return "06:00 - 12:00";
  } else if (dayTime === "afternoon") {
    return "12:00 - 18:00";
  } else if (dayTime === "evening") {
    return "18:00 - 00:00";
  } else {
    return "00:00 - 06:00";
  }
}

function mapDateToDayTime(date) {
  return mapHourToDayTime(date.getHours());
}

function DayTimesComparison() {
  const [data, setData] = useState(undefined);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const filter = async () => {
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
        sort: [{ local_date: { order: "asc" } }],
      }
    );

    const response = await getWithQuery(query);
    const numberHours = response.aggregations.by_hour.buckets.length;
    let result = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
    for (let i = 0; i < numberHours; i++) {
      const date = new Date(
        response.aggregations.by_hour.buckets[i].key_as_string
      );
      result[mapDateToDayTime(date)] +=
        response.aggregations.by_hour.buckets[i].doc_count;
    }
    result = Object.keys(result).map((key) => {
      return {
        x: key,
        y: result[key],
      };
    });
    setData(result);
  };

  useEffect(
    () => filter(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryFilter, regionFilter, topicFilter, deviceFilter]
  );

  return (
    <Fragment>
      {data ? (
        <ReactEcharts
          option={{
            grid: {
              left: "10%",
              containLabel: true,
            },
            title: {
              text: "Total number of requests per day time",
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            xAxis: {
              name: "Local day time",
              nameLocation: "middle",
              nameGap: 30,
              nameTextStyle: {
                fontSize: 14,
                fontWeight: "bolder",
              },
              axisTick: {
                show: false,
              },
              type: "category",
              data: data.map((e) => e.x),
            },
            yAxis: {
              type: "value",
              name: "Number of requests",
              nameLocation: "middle",
              nameGap: 90,
              nameTextStyle: {
                fontSize: 14,
                fontWeight: "bolder",
              },
            },
            series: [
              {
                type: "bar",
                tooltip: {
                  formatter: (params) =>
                    `Number of requests: ${params.value} </br>Day time: ${
                      params.name
                    } </br>Time range: ${mapDayTimeToTimeRange(params.name)}`,
                  extraCssText: "box-shadow: 0 0 0 rgba(0, 0, 0, 0);",
                },
                data: data.map((e) => e.y),
              },
            ],
          }}
        />
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}

export default DayTimesComparison;
