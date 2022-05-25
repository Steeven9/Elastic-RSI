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
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

  const getQuery = async () => {
    const isCountrySelected = !countryFilter.includes("Global");
    const isRegionSelected = !regionFilter.includes("All");
    const isTopicSelected = selectedTopics.length > 0;

    const barsData = [];
    await Promise.all(
      selectedTopics.map(async (el) => {
        try {
          const query = {
            ...(isCountrySelected || isRegionSelected || isTopicSelected
              ? {
                  query: {
                    bool: {
                      must: [
                        ...(isCountrySelected
                          ? [
                              {
                                terms: {
                                  country: countryFilter,
                                },
                              },
                            ]
                          : []),
                        ...(isRegionSelected
                          ? [
                              {
                                terms: {
                                  admin1: regionFilter,
                                },
                              },
                            ]
                          : []),
                        ...(isTopicSelected
                          ? [
                              {
                                match: {
                                  topics: el,
                                },
                              },
                            ]
                          : []),
                      ],
                    },
                  },
                }
              : {}),
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

          const res = await getWithQuery(query);

          const resAgg = res.aggregations.daysOfWeek.buckets;
          const resArray = Object.keys(resAgg).map((key) => {
            return resAgg[key].doc_count;
          });

          const barData = {
            name: el,
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series",
            },
            data: resArray,
          };

          barsData.push(barData);
        } catch (err) {
          console.error(err);
        }
      })
    );

    setdata(barsData);
  };

  const getTopicsQuery = async () => {
    const query = {
      topics: {
        terms: {
          field: "topics",
          size: 10000,
          min_doc_count: 50,
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
  };

  useEffect(() => {
    getTopicsQuery();
  }, []);

  useEffect(() => {
    getQuery();
  }, [countryFilter, regionFilter]);

  return (
    <>
      <Grid sx={{ padding: 10 }} spacing={4} container>
        <Grid item xs={6} md={8}>
          <Autocomplete
            multiple
            id="tags-standard"
            onChange={handleChange}
            options={topics}
            getOptionDisabled={() => (selectedTopics.length > 3 ? true : false)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Select topics to compare (up to 4)"
                placeholder="Topics"
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <Button variant="outlined" onClick={handleClick}>
            Compare
          </Button>
        </Grid>
      </Grid>
      {chartData.length > 0 ? (
        <div>
          <ReactEcharts
            option={{
              title: {
                text: "# requests per topic and days of week",
                left: "center",
                top: 20,
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
