import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../actions";
import { getAggs, getWithQuery } from "../API";

const GeneralActions = () => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [devices, setDevices] = useState([]);

  const setCountryFilter = useCallback(
    (data) => {
      dispatch(actions.setCountryFilter(data));
    },
    [dispatch]
  );

  const setRegionFilter = useCallback(
    (data) => {
      dispatch(actions.setRegionFilter(data));
    },
    [dispatch]
  );

  const setTopicFilter = useCallback(
    (data) => {
      dispatch(actions.setTopicFilter(data));
    },
    [dispatch]
  );

  const setDeviceFilter = useCallback(
    (data) => {
      dispatch(actions.setDeviceFilter(data));
    },
    [dispatch]
  );

  const getCountriesQuery = async () => {
    const query = {
      countries: {
        terms: {
          field: "country",
          size: 200,
        },
      },
    };

    const res = await getAggs(query);

    const resAgg = res.countries.buckets;
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].key;
    });
    setCountries(resArray);
  };

  const getRegions = async (country) => {
    const isCountrySelected = country.length > 0;
    const query = {
      ...(isCountrySelected
        ? {
            query: {
              bool: {
                must: {
                  terms: {
                    country: country,
                  },
                },
              },
            },
          }
        : {}),
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

    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].key;
    });

    setRegions(resArray);
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

    const resAgg = res.topics.buckets;
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].key;
    });
    setTopics(resArray);
  };

  const getDevicesQuery = async () => {
    const query = {
      user_agent: {
        terms: {
          field: "user_agent",
          size: 10000,
          min_doc_count: 50,
        },
      },
    };

    const res = await getAggs(query);

    const resAgg = res.user_agent.buckets;
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].key;
    });
    setDevices(resArray);
  };

  useEffect(() => {
    getCountriesQuery();
    getTopicsQuery();
    getDevicesQuery();
  }, []);

  const handleChangeCountry = (evt, val) => {
    setCountryFilter(val);
    getRegions(val);
  };

  const handleChangeRegion = (evt, val) => {
    setRegionFilter(val);
  };

  const handleChangeDevice = (evt, val) => {
    setDeviceFilter(val);
  };

  const handleChangeTopic = (evt, val) => {
    setTopicFilter(val);
  };

  return (
    <Grid
      sx={{ padding: 10, border: "1px solid" }}
      container
      justifyContent="space-between"
    >
      <Grid item xs={6} md={12}>
        <Typography align="center" variant="h4">
          General Filters
        </Typography>
      </Grid>
      <Grid item xs={6} md={5}>
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={handleChangeCountry}
          options={countries}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select countries"
              placeholder="Countries"
            />
          )}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={handleChangeRegion}
          options={regions}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select regions"
              placeholder="Regions"
            />
          )}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={handleChangeTopic}
          options={topics}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select topics"
              placeholder="Topics"
            />
          )}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={handleChangeDevice}
          options={devices}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select device"
              placeholder="Device"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default GeneralActions;
