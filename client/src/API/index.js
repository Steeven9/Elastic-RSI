import axios from "axios";

const headers = {
  Authorization: `Bearer ${process.env.REACT_APP_BACKEND_API_TOKEN}`,
  "Content-Type": "application/json",
};

export const getAll = async () => {
  try {
    const res = await axios.get(`/api/elastic/getAll`, { headers });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getWithQuery = async (query) => {
  try {
    const res = await axios.post(
      `api/elastic/get`,
      { index: "rsi", ...query },
      { headers: headers }
    );
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getAggs = async (query) => {
  try {
    const res = await axios.post(
      `https:elastic-rsi.soulsbros.ch/api/elastic/aggs`,
      { ...query },
      { headers: headers }
    );

    return res.data;
  } catch (err) {
    console.error(err);
  }
};
