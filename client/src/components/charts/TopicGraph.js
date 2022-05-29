import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAggs, getWithQuery } from "../../API";
import buildQuery from "../../utils/query";

const TopicGraph = () => {
  const [chartData, setChartData] = useState({
    nodes: [],
    links: [],
    categories: [],
  });
  const [numTopTopics, setNumTopTopics] = useState(30);

  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const getQuery = async () => {
    const topTopicsQuery = {
      frequentTopics: {
        terms: {
          field: "topics",
          size: 30,
        },
      },
    };

    const devicesRes = await getAggs(topTopicsQuery);
    const topDevices = devicesRes.frequentTopics.buckets.map((x) => x.key);

    const query = buildQuery(
      {
        country: countryFilter,
        admin1: regionFilter,
        user_agent: deviceFilter,
        topic: topDevices,
      },
      {
        _source: ["topics"],
        size: numTopTopics,
      }
    );

    const res = await getWithQuery(query);
    const resAgg = res.hits.hits.map((x) => x._source.topics);
    const graph = {};
    resAgg.forEach((topics) => {
      topics.forEach((topic) => {
        topics.forEach((neighbor) => {
          if (!(topic in graph)) {
            graph[topic] = new Set();
          }
          if (topic !== neighbor) {
            graph[topic].add(neighbor);
          }
        });
      });
    });

    const topics = Object.keys(graph);
    const n = topics.length;
    const angleSlice = 360 / n;

    const links = new Set();
    const categories = new Array(n);
    const nodes = topics.map((topic, idx) => {
      graph[topic].forEach((neighbor) => {
        links.add({ source: topic, target: neighbor });
      });
      categories[idx] = { name: topic };
      return {
        id: topic,
        name: topic,
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
  }, [countryFilter, regionFilter, deviceFilter, numTopTopics]);

  return (
    <>
      {chartData.nodes.length > 0 ? (
        <div>
          <ReactEcharts
            style={{ height: 750 }}
            option={{
              title: {
                text: "Topics correlation graph",
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
                  name: "Topic graph",
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
            <InputLabel id="top-topics-selector-label"># top topics</InputLabel>
            <Select
              id="top-topics-selector"
              labelId="top-topics-selector-label"
              label="# top topics"
              onChange={(ev) => setNumTopTopics(ev.target.value)}
              value={numTopTopics}
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

export default TopicGraph;
