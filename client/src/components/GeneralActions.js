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
    const resArray = Object.keys(resAgg).map((key) => {
     return resAgg[key].key;
    });
    setCountries(resArray);
  };

  const getRegions = async (country) => {
    const isCountrySelected = country.length > 0;
    const query = {
      ...(isCountrySelected ? {
        query: {
          bool: {
            must: {
              terms: {
                country: country
              }
            }
          }
        }
      } : {}),
      aggs: {
        regions: {
          terms: {
            field: "admin1",
            size: 200,
            order: {
              _key: 'asc'
            }
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

  useEffect(() => {
    getCountriesQuery();
  }, []);

  const handleChangeCountry = (evt, val) => {
    setCountryFilter(val);
    getRegions(val);
  };

  const handleChangeRegion = (evt, val) => {
    setRegionFilter(val);
  };

  return (
    <Grid sx={{padding: 10,border: '1px solid'}} container justifyContent='space-between'>
      <Grid item xs={6} md={12}>
        <Typography align="center" variant="h4">
          General Filters
        </Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Autocomplete
          getOptionDisabled={() => (countryFilter.length > 3 ? true : false)}
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
      <Grid item xs={6} md={4} >
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
