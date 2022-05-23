import {
  Autocomplete, Grid, TextField,
  Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import { getAggs, getWithQuery } from "../API";

const GeneralActions = () => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);

  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

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
    const countries = ["Global"];
    const resArray = Object.keys(resAgg).forEach((key) => {
      countries.push(resAgg[key].key);
    });
    setCountries(countries);
  };

  const getRegions = async (country) => {
    const query = {
      query: {
        match: {
          country: country,
        },
      },
      aggs: {
        regions: {
          terms: {
            field: "admin1",
            size: 200,
          },
        },
      },
    };

    const res = await getWithQuery(query);
    const resAgg = res.aggregations.regions.buckets;

    const regions = ["All"];
    const resArray = Object.keys(resAgg).forEach((key) => {
      regions.push(resAgg[key].key);
    });
    setRegions(regions);
  };

  useEffect(() => {
    getCountriesQuery();
  }, [countryFilter]);

  const handleChangeCountry = (evt, val) => {
    setCountryFilter(val);
    if (evt.target.value !== "All") {
      getRegions(evt.target.value);
    }
  };

  const handleChangeRegion = (evt) => {
    setRegionFilter(evt.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} md={12}>
        <Typography align="center" variant="h4">
          General Filters
        </Typography>
      </Grid>
      <Grid item xs={6} md={6}>
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
      <Grid item xs={6} md={6}>
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
    </Grid>
  );
};

export default GeneralActions;
