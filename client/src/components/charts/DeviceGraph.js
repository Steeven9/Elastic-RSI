import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAggs, getWithQuery } from "../../API";
import buildQuery from "../../utils/query";

const DeviceGraph = () => {
  const [chartData, setChartData] = useState({
    nodes: [],
    links: [],
    categories: [],
  });

  const [numTopDevices, setNumTopDevices] = useState(30);

  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);

  const getQuery = async () => {
    const topDevicesQuery = {
      frequentDevices: {
        terms: {
          field: "user_agent",
          size: 30,
        },
      },
    };

    const devicesRes = await getAggs(topDevicesQuery);
    const topDevices = devicesRes.frequentDevices.buckets.map((x) => x.key);

    const query = buildQuery(
      {
        country: countryFilter,
        admin1: regionFilter,
        topic: topicFilter,
        user_agent: topDevices,
      },
      {
        _source: ["user_agent"],
        size: numTopDevices,
      }
    );

    const res = await getWithQuery(query);
    const resAgg = res.hits.hits.map((x) => x._source.user_agent);
    const graph = {};
    resAgg.forEach((devices) => {
      devices.forEach((device) => {
        devices.forEach((neighbor) => {
          if (!(device in graph)) {
            graph[device] = new Set();
          }
          if (device !== neighbor) {
            graph[device].add(neighbor);
          }
        });
      });
    });

    const devices = Object.keys(graph);
    const n = devices.length;
    const angleSlice = 360 / n;

    const links = new Set();
    const categories = new Array(n);
    const nodes = devices.map((device, idx) => {
      graph[device].forEach((neighbor) => {
        links.add({ source: device, target: neighbor });
      });
      categories[idx] = { name: device };
      return {
        id: device,
        name: device,
        symbolSize: 20,
        x: Math.cos(angleSlice * idx) * 200,
        y: Math.sin(angleSlice * idx) * 200,
        value: 1,
        category: idx,
      };
    });

    setChartData({
      nodes,
      categories,
      links: [...links],
    });
  };

  useEffect(() => {
    getQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryFilter, regionFilter, topicFilter, numTopDevices]);

  return (
    <>
      {chartData.nodes.length > 0 ? (
        <div>
          <ReactEcharts
            style={{ height: 750 }}
            option={{
              title: {
                text: "Device correlation graph",
                left: "center",
              },
              legend: [
                {
                  data: [],
                },
              ],
              animationDurationUpdate: 1500,
              animationEasingUpdate: "quinticInOut",
              series: [
                {
                  name: "Device graph",
                  type: "graph",
                  layout: "circular",
                  circular: {
                    rotateLabel: true,
                  },
                  data: chartData.nodes,
                  links: chartData.links,
                  categories: chartData.categories,
                  roam: true,
                  label: {
                    position: "right",
                    formatter: "{b}",
                    show: true,
                  },
                  lineStyle: {
                    color: "source",
                    curveness: 0.3,
                  },
                },
              ],
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="top-devices-selector-label">
              # top devices
            </InputLabel>
            <Select
              id="top-devices-selector"
              labelId="top-devices-selector-label"
              label="# top devices"
              onChange={(ev) => setNumTopDevices(ev.target.value)}
              value={numTopDevices}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </div>
      ) : null}
    </>
  );
};

export default DeviceGraph;
