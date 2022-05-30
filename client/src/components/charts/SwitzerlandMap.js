import { Slider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { scaleLinear } from "d3-scale";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import * as actions from "../../actions";
import { getWithQuery } from "../../API";
import geoUrl from "../../geomaps/switzerland_admin1.json";
import buildQuery from "../../utils/query";

const SwitzerlandMap = () => {
  const dispatch = useDispatch();

  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const [cantons, setCantons] = useState([]);
  const [rangeVal, setRangeVal] = useState([0, 1]);
  const [maxVal, setMaxVal] = useState(0);
  const [marks, setMarks] = useState([]);

  const [content, setContent] = useState("Loading...");

  const colorScale = scaleLinear()
    .domain(rangeVal)
    .range(["#ffedea", "#ff5233"]);

  const getMapData = async () => {
    const query = buildQuery(
      {
        country: ["CH"],
        admin1: regionFilter,
        topics: topicFilter,
        user_agent: deviceFilter,
      },
      {
        size: 0,
        aggs: {
          cantons: {
            terms: {
              field: "admin1",
              size: 200,
            },
          },
        },
      }
    );

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.cantons.buckets;
    const resArray = Object.keys(resAgg).map((key) => {
      return { name: resAgg[key].key, value: resAgg[key].doc_count };
    });

    const max = resArray.reduce((acc, x) => (x.value > acc ? x.value : acc), 0);
    setMaxVal(Math.ceil(max * 0.5));
    setMarks([
      { value: 0, label: "Min." },
      { value: Math.ceil(max * 0.5), label: "Max." },
    ]);
    setRangeVal([0, Math.ceil(max * 0.5)]);
    setContent("");

    setCantons(resArray);
  };

  const handleChange = (event, newValue) => {
    setRangeVal(newValue);
  };

  const rounded = (num = 0) => {
    if (num > 1000000000) {
      return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
      return Math.round(num / 100000) / 10 + "M";
    } else if (num < 1000) {
      return num;
    } else {
      return Math.round(num / 100) / 10 + "K";
    }
  };

  useEffect(() => {
    getMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionFilter, topicFilter, deviceFilter]);

  const setCountryFilter = useCallback(
    (data) => {
      dispatch(actions.setCountryFilter(data));
    },
    [dispatch]
  );

  const setAdmin1 = useCallback(
    (data) => {
      dispatch(actions.setAdmin1(data));
    },
    [dispatch]
  );

  const loadChRegions = async () => {
    const query = {
      query: {
        term: {
          country: "CH",
        },
      },
      aggs: {
        regions: {
          terms: {
            field: "admin1",
            size: 200,
            order: {
              _key: "asc",
            },
          },
        },
      },
    };

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.regions.buckets;

    setAdmin1(Object.keys(resAgg).map((key) => resAgg[key].key));
  };
  useEffect(() => {
    setCountryFilter(["CH"]);
    loadChRegions();
  });

  return (
    <>
      <Box sx={{ padding: "0 50px" }}>
        <Typography id="rangeMap" gutterBottom>
          Min. and Max. number of request slider
        </Typography>
        <Slider
          getAriaLabel={() => "Range"}
          aria-labelledby="rangeMap"
          value={rangeVal}
          onChange={handleChange}
          valueLabelDisplay="auto"
          max={maxVal}
          step={100000}
          marks={marks}
        />
      </Box>
      <ComposableMap data-tip="" viewBox="412 38 15 15" height={400}>
        {cantons.length > 0 && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = cantons.find(
                  (s) => s.name === geo.properties.COUNTRY
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d && d.value ? colorScale(d.value) : "#F5F4F6"}
                    onMouseEnter={() => {
                      const { COUNTRY } = geo.properties;
                      const value = cantons.find((s) => s.name === COUNTRY);
                      setContent(`${COUNTRY} — ${rounded(value?.value)}`);
                    }}
                    onMouseLeave={() => {
                      setContent("");
                    }}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: "indigo",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
      <ReactTooltip>{content}</ReactTooltip>
    </>
  );
};

export default SwitzerlandMap;
