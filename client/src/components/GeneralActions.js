import {
  Autocomplete,
  Divider,
  List,
  ListItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import { getAggs, getWithQuery } from "../API";
import { Box } from "@mui/system";

const GeneralActions = () => {
  const dispatch = useDispatch();
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);
  const topicFilter = useSelector((st) => st.generalReducer.topicFilter);
  const deviceFilter = useSelector((st) => st.generalReducer.deviceFilter);
  const admin1 = useSelector((st) => st.generalReducer.admin1);
  const tab = useSelector((st) => st.generalReducer.tab);

  const [countries, setCountries] = useState([]);
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

  const setAdmin1 = useCallback(
    (data) => {
      dispatch(actions.setAdmin1(data));
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

    setAdmin1(
      Object.keys(resAgg).map((key) => {
        return resAgg[key].key;
      })
    );
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

  const filtersList = [
    {
      id: "filter-countries",
      onChange: handleChangeCountry,
      options: countries,
      value: countryFilter,
      label: "Select countries",
      icon: <PublicIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />,
    },
    {
      id: "filter-regions",
      onChange: handleChangeRegion,
      options: admin1,
      value: regionFilter,
      label: "Select regions",
      icon: (
        <LocationCityIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      ),
    },
    {
      id: "filter-topics",
      onChange: handleChangeTopic,
      options: topics,
      value: topicFilter,
      label: "Select topics",
      icon: <LocalOfferIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />,
    },
    {
      id: "filter-device",
      onChange: handleChangeDevice,
      options: devices,
      value: deviceFilter,
      label: "Select devices",
      icon: (
        <DevicesOtherIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      ),
    },
  ];

  return (
    <div>
      <Toolbar />
      <Toolbar>
        <Typography variant="h4">Filters</Typography>
      </Toolbar>
      <Divider />
      <List>
        {filtersList
          // Disable country selector in switzerland-only view
          .filter((x) => x.id !== "filter-countries" || tab !== "switzerland")
          .map((x) => (
            <ListItem key={x.id}>
              <Autocomplete
                multiple
                onChange={x.onChange}
                value={x.value}
                fullWidth
                options={x.options}
                renderInput={(params) => (
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    {x.icon}
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      label={x.label}
                    />
                  </Box>
                )}
              />
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default GeneralActions;
