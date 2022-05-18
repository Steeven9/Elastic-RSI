import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { getAggs } from "../../API";

const CountsPerDayOfWeek = () => {
  const [chartData, setdata] = useState([]);

  const getQuery = async () => {
    const query = {
      asd: {
        filters: {
          filters: {
            1: { match: { day_of_week: 1 } },
            2: { match: { day_of_week: 2 } },
            3: { match: { day_of_week: 3 } },
            4: { match: { day_of_week: 4 } },
            5: { match: { day_of_week: 5 } },
            6: { match: { day_of_week: 6 } },
            7: { match: { day_of_week: 7 } },
          },
        },
      },
    };

    const res = await getAggs(query);

    const resArray = Object.keys(res.asd.buckets).map((key) => {
      return res.asd.buckets[key].doc_count;
    });
    console.log(resArray);
    setdata(resArray);
  };

  useEffect(() => {
    getQuery();
  }, []);

  return chartData.length > 0 ? (
    <div>
      <ReactEcharts
        option={{
          grid: {
            left: "0%",
            containLabel: true,
          },
          title: {
            text: "# per days of week",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          xAxis: {
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              type: "bar",
              large: true,
              data: chartData,
              barWidth: "90%",
            },
          ],
          toolbox: {
            right: 10,
          },
        }}
      />
    </div>
  ) : null;
};

export default CountsPerDayOfWeek;
