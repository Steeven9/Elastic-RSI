import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAggs } from "../../API";

const TopicsView = () => {
  const [chartData, setdata] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);

  const getQuery = async () => {
    let query = {
      daysOfWeek: {
        terms: {
          field: "topics",
          size: 1000,
        },
      },
    };
    if (countryFilter !== "Global") {
      query = {
        daysOfWeek: {
          filter: { term: { country: countryFilter } },
          aggs: {
            daysOfWeek: {
              terms: {
                field: "topics",
                size: 1000,
              },
            },
          },
        },
      };
    }

    const res = await getAggs(query);
    let resAgg = {};
    if (countryFilter !== "Global") {
      resAgg = res.daysOfWeek.daysOfWeek.buckets;
    } else {
      resAgg = res.daysOfWeek.buckets;
    }
    const resArray = Object.keys(resAgg).map((key) => {
      return { name: resAgg[key].key, value: resAgg[key].doc_count };
    });
    setdata(resArray);
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
