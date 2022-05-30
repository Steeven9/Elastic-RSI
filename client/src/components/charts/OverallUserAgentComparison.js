import React from "react";
import { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { getCount } from "../../API";
import { useSelector } from "react-redux";
import buildQuery from "../../utils/query";
import Loading from "../Loading";

function OverallUserAgentComparison() {
  const [data, setData] = useState(undefined);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

  useEffect(() => {
    async function fetchData() {
      let result = [];
      const devices = [
        "desktop",
        "smartphone",
        "tablet",
        "tv",
        "portable media player",
      ];
      await Promise.all(
        devices.map(async (device, i) => {
          const query = buildQuery(
            {
              country: countryFilter,
              admin1: regionFilter,
              user_agent: [device],
            },
            {}
          );
          const count = await getCount(query);
          result[i] = {
            device: device,
            count: count,
          };
        })
      );
      result = result.sort((l, r) => l.count - r.count);
      result = result.filter((e) => e.count > 0);
      result = {
        devices: result.map((e) => e.device),
        counts: result.map((e) => e.count),
      };
      setData(result);
    }
    fetchData();
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
              containLabel: true,
            },
            title: {
              text: "Total number of requests per device type",
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            yAxis: {
              name: "Device type",
              nameLocation: "end",
              nameGap: 10,
              nameTextStyle: {
                fontSize: 14,
                fontWeight: "bolder",
              },
              axisTick: {
                show: false,
              },
              type: "category",
              data: data.devices,
            },
            xAxis: {
              type: "value",
              name: "Number of requests",
              nameLocation: "middle",
              nameGap: 40,
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
                    `Device type: ${params.name} </br>Number of requests: ${
                      params.value
                    } </br> Overall share: ${(
                      (100 * params.value) /
                      data.counts.reduce((a, e) => a + e, 0)
                    ).toFixed(1)}%`,
                  extraCssText: "box-shadow: 0 0 0 rgba(0, 0, 0, 0);",
                },
                data: data.counts,
              },
            ],
          }}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default OverallUserAgentComparison;
