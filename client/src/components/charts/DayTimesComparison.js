import React from "react";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import ReactEcharts from "echarts-for-react";
import { getWithQuery } from "../../API";
import { useSelector } from "react-redux";

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

function DayTimesComparison() {
  const [data, setData] = useState(undefined);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);


  useEffect(() => {
    const isCountrySelected = countryFilter !== 'Global'
    const isRegionSelected = regionFilter !== 'All'
    const query = {
      ...(isCountrySelected || isRegionSelected ? {
        query: {
          bool: {
            must: [
              ...(isCountrySelected ? [{
                match: {
                  country: countryFilter,
                },
              }] : []),
              ...(isRegionSelected ? [{
                match: {
                  admin1: regionFilter,
                },
              }] : [])
            ],
          },
        }
      } : {}),
      aggs: {
        by_day: {
          date_histogram: {
            field: "date",
            calendar_interval: "day",
            keyed: true,
            format: "yyyy-MM-dd",
          },
          aggs: {
            by_hour: {
              date_histogram: {
                field: "date",
                calendar_interval: "hour",
              },
            },
          },
        },
      },
      _source: false,
    };
    getWithQuery(query).then((response) => {
      response.aggregations.by_day.buckets;
      let result = {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      };
      let dayCounter = 0;
      for (const dayKey in response.aggregations.by_day.buckets) {
        for (const hourObject of response.aggregations.by_day.buckets[dayKey]
          .by_hour.buckets) {
          let hour = hourObject.key_as_string.split(" ")[1].split(":")[0];
          hour = parseInt(hour);
          result[mapHourToDayTime(hour)] += hourObject.doc_count;
        }
        dayCounter += 1;
      }
      for (const dayTimeKey in result) {
        result[dayTimeKey] = result[dayTimeKey] / dayCounter;
      }
      result = Object.keys(result).map((key) => {
        return {
          x: key,
          y: result[key],
        };
      });
      setData(result);
    });
  }, [countryFilter, regionFilter]);

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
              text: "Average number of requests per day time",
              left: "center",
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
              type: "category",
              data: data.map((e) => e.x),
            },
            yAxis: {
              type: "value",
              name: "Number requests",
              nameLocation: "middle",
              nameGap: 70,
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
                    `Number requests: ${params.value} </br>Day time: ${params.name}`,
                  extraCssText: "box-shadow: 0 0 0 rgba(0, 0, 0, 0);",
                },
                data: data.map((e) => e.y),
              },
            ],
          }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>Loading...</div>
      )}
    </Fragment>
  );
}

export default DayTimesComparison;
