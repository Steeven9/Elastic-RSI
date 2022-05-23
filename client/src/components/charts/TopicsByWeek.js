import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAggs, getWithQuery } from "../../API";

const TopicsByWeek = () => {
  const [chartData, setdata] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);

  const getQuery = async () => {
    const selectedCountry = {
      term: {
        country: {
          value: countryFilter,
        },
      },
    };

    let query = {
      query: {
        bool: {
          must: [],
        },
      },
      aggs: {
        daysOfWeek: {
          filters: {
            filters: {
              1: { match: { day_of_week: "1" } },
              2: { match: { day_of_week: "2" } },
              3: { match: { day_of_week: "3" } },
              4: { match: { day_of_week: "4" } },
              5: { match: { day_of_week: "5" } },
              6: { match: { day_of_week: "6" } },
              7: { match: { day_of_week: "7" } },
            },
          },
        },
      },
    };

    const barsData = [];
    await Promise.all(
      selectedTopics.map(async (el) => {
        try {
          const obj = {
            term: {
              topics: el,
            },
          };
          
          if (countryFilter !== "Global") {
            query.query.bool.must = [selectedCountry, obj];
          } else {
            query.query.bool.must = [obj];
          }

          const res = await getWithQuery(query);
          let resAgg = {};

          resAgg = res.aggregations.daysOfWeek.buckets;
          const resArray = Object.keys(resAgg).map((key) => {
            return resAgg[key].doc_count;
          });

          const barData = {
            name: el,
            type: 'bar',
            barGap: 0,
            emphasis: {
              focus: 'series'
            },
            data: resArray
          };

          barsData.push(barData);
        } catch (err) {
          console.error(err);
        }
      })
    );

    setdata(barsData)
  };

  const getTopicsQuery = async () => {
    const query = {
      topics: {
        terms: {
          field: "topics",
          size: 10000,
        },
      },
    };

    const res = await getAggs(query);

    const resQuery = res.topics.buckets;
    const resArray = Object.keys(resQuery).map((key) => {
      return resQuery[key].key;
    });
    setTopics(resArray);
  };

  const handleChange = (evt, val) => {
    setSelectedTopics(val);
  };

  const handleClick = (evt) => {
    getQuery();
  }

  useEffect(() => {
    getTopicsQuery();
  }, [countryFilter]);

  return (
    <>
      <Grid container={true}>
        <Autocomplete
          multiple
          sx={{ width: 500 }}
          id="tags-standard"
          onChange={handleChange}
          options={topics}
          getOptionDisabled={() => (selectedTopics.length > 3 ? true : false)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Multiple values"
              placeholder="Topics"
            />
          )}
        />
        <Button variant="outlined" onClick={handleClick}>Compare</Button>
      </Grid>
      {chartData.length > 0 ? (
        <div>
          <ReactEcharts
            option={{
              title: {
                text: "# requests per topic and days of week",
                left: "center",
                top: 20
              },
              legend: {
                data: selectedTopics,
                top: 0,
                right: 100,
              },
              tooltip: {
                trigger: "item",
              },
              xAxis: {
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                name: "Days of the week",
                nameLocation: "middle",
                nameGap: "30",
              },
              yAxis: {
                type: "value",
                name: "# of requests",
                nameLocation: "middle",
                nameGap: "90",
              },
              series: chartData,
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default TopicsByWeek;
