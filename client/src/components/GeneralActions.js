import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import { getAggs, getWithQuery } from "../API";

const GeneralActions = () => {
  const dispatch = useDispatch();

  const selectItems = ["Global", "Abroad Global", "Abroad Europe"];
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
    const resArray = Object.keys(resAgg).map((key) => {
      return resAgg[key].key;
    });
    setRegions(resArray);
  };

  useEffect(() => {
    getCountriesQuery();
  }, [countryFilter]);

  const handleChangeCountry = (evt) => {
    setCountryFilter(evt.target.value);
    if (evt.target.value !== "All") {
      getRegions(evt.target.value);
    }
  };

  const handleChangeRegion = (evt) => {
    setRegionFilter(evt.target.value);
  };

  return (
    <Box
      sx={{
        margin: "20px",
        padding: "40px",
        border: "2px solid #b90009",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography align="center" variant="h4">
        General Filters
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <FormControl>
          <InputLabel id="selectZoneOrCountry">Zone</InputLabel>
          <Select
            labelId="selectZoneOrCountry"
            value={countryFilter}
            label={countryFilter}
            onChange={handleChangeCountry}
            sx={{ minWidth: 200 }}
          >
            {selectItems.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
            <ListSubheader>Countries</ListSubheader>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="selectZoneOrCountry">Regions</InputLabel>
          <Select
            labelId="selectZoneOrCountry"
            value={regionFilter}
            label={regionFilter}
            onChange={handleChangeRegion}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={"All"}>All</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default GeneralActions;
