export const getAll = () => {
  "GET_ALL";
};

export const setDrawer = (payload) => ({
  type: "SET_DRAWER",
  payload,
});

export const setTab = (payload) => ({
  type: "SET_TAB",
  payload,
});

export const setCountryFilter = (payload) => ({
  type: "SET_COUNTRY_FILTER",
  payload,
});

export const setRegionFilter = (payload) => ({
  type: "SET_REGION_FILTER",
  payload,
});

export const setTopicFilter = (payload) => ({
  type: "SET_TOPIC_FILTER",
  payload,
});

export const setDeviceFilter = (payload) => ({
  type: "SET_DEVICE_FILTER",
  payload,
});

export const setAdmin1 = (payload) => ({
  type: "SET_ADMIN1",
  payload,
});
