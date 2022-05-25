const FILTERS = ["country", "admin1", "topics", "user_agent"];

const buildQuery = (config, extra) => {
  const must = [];
  const addFilter = (key) => {
    if (config[key] && config[key].length > 0) {
      must.push({
        terms: {
          [key]: config[key],
        },
      });
    }
  };
  FILTERS.forEach((key) => addFilter(key));

  return {
    query: {
      bool: {
        must,
      },
    },
    ...extra,
  };
};

export default buildQuery;
