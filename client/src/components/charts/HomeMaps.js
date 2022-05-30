import { Slider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { scaleLinear } from "d3-scale";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { getWithQuery } from "../../API";
import geoUrl from "../../geomaps/world_admin0.json";
import buildQuery from "../../utils/query";

const HomeMaps = () => {
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);

  const [countries, setCountries] = useState([]);
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
        country: countryFilter,
        admin1: regionFilter,
        topics: topicFilter,
        user_agent: deviceFilter,
      },
      {
        size: 0,
        aggs: {
          countries: {
            terms: {
              field: "country",
              size: 200,
            },
          },
        },
      }
    );

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.countries.buckets;
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

    setCountries(resArray);
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
  }, [countryFilter, regionFilter, topicFilter, deviceFilter]);
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
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 130,
        }}
        data-tip=""
        height={400}
        style={{ outline: "none" }}
      >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {countries.length > 0 && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = countries.find(
                  (s) => s.name === geo.properties.ISO_A2
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d && d.value ? colorScale(d.value) : "#F5F4F6"}
                    onMouseEnter={() => {
                      const { NAME, ISO_A2 } = geo.properties;
                      const value = countries.find((s) => s.name === ISO_A2);
                      setContent(`${NAME} — ${rounded(value?.value)}`);
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

export default HomeMaps;
