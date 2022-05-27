const initialState = {
  page: "home",
  drawer: false,
  tab: "home",
  countryFilter: [],
  regionFilter: [],
  topicFilter: [],
  deviceFilter: [],
};

const generalReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_PAGE":
      return {
        ...state,
        page: payload,
      };
    case "SET_DRAWER":
      return {
        ...state,
        drawer: payload,
      };
    case "SET_TAB":
      return {
        ...state,
        tab: payload,
      };
    case "SET_COUNTRY_FILTER":
      return {
        ...state,
        countryFilter: payload,
      };
    case "SET_REGION_FILTER":
      return {
        ...state,
        regionFilter: payload,
      };
    case "SET_TOPIC_FILTER":
      return {
        ...state,
        topicFilter: payload,
      };
    case "SET_DEVICE_FILTER":
      return {
        ...state,
        deviceFilter: payload,
      };
    default:
      return state;
  }
};

export default generalReducer;
