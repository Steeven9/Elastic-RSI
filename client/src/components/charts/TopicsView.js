import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";

const TopicsView = () => {
  const [chartData, setData] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

  const getQuery = async () => {
    const query = buildQuery(
      {
        country: countryFilter,
        admin1: regionFilter,
      },
      {
        aggs: {
          daysOfWeek: {
            terms: {
              field: "topics",
              size: 1000,
            },
          },
        },
      }
    );

    const res = await getWithQuery(query);
    let resAgg = {};

    resAgg = res.aggregations.daysOfWeek.buckets;
    const resArray = Object.keys(resAgg).map((key) => {
      return { name: resAgg[key].key, value: resAgg[key].doc_count };
    });
    setData(resArray);
  };

  const getLevelOption = () => {
    return [
      {
        itemStyle: {
          borderWidth: 0,
          gapWidth: 5,
        },
      },
      {
        itemStyle: {
          gapWidth: 1,
        },
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          gapWidth: 1,
          borderColorSaturation: 0.6,
        },
      },
    ];
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getQuery(), [countryFilter, regionFilter]);

  return chartData.length > 0 ? (
    <div>
      <ReactEcharts
        option={{
          grid: {
            containLabel: true,
          },
          title: {
            text: "Treemap of topics",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          series: [
            {
              name: "Treemap of topics",
              type: "treemap",
              visibleMin: 100,
              label: {
                show: true,
                formatter: "{b}",
              },
              itemStyle: {
                borderColor: "#fff",
              },
              levels: getLevelOption(),
              data: chartData,
            },
          ],
        }}
      />
    </div>
  ) : null;
};

export default TopicsView;
