import { FormControlLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { getAggs } from "../../API";

const CountsPerDayOfWeek = () => {
  const [chartData, setdata] = useState([]);
  const [filter, setFilter] = useState("global");

  const getQuery = async () => {
    let query = {
      daysOfWeek: {
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
    if (filter == "ch") {
      query = {
        daysOfWeek: {
          filter: { term: { country: "CH" } },
          aggs: {
            daysOfWeek: {
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
          },
        },
      };
    }

    const res = await getAggs(query);
    let resAgg = {};
    if (filter == "ch") {
      resAgg = res.daysOfWeek.daysOfWeek.buckets;
    } else {
      resAgg = res.daysOfWeek.buckets;
    }
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].doc_count;
    });
    setdata(resArray);
  };

  useEffect(() => {
    getQuery();
  }, [filter]);

  const handleChange = (ev) => {
    console.log(ev.target.value);
    setFilter(ev.target.value);
  };

  return chartData.length > 0 ? (
    <div>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">
          Filter by Global or CH
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={filter}
          onChange={handleChange}
        >
          <FormControlLabel value="global" control={<Radio />} label="Global" />
          <FormControlLabel value="ch" control={<Radio />} label="CH" />
        </RadioGroup>
      </FormControl>
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
            name: "Days of the week",
            nameLocation: "middle",
          },
          yAxis: {
            type: "value",
            name: "# of requests",
            nameLocation: "middle",
          },
          series: [
            {
              type: "bar",
              large: true,
              data: chartData,
              barWidth: "90%",
            },
          ],
        }}
      />
    </div>
  ) : null;
};

export default CountsPerDayOfWeek;
