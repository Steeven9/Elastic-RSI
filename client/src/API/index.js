import axios from 'axios';

const headers = {
    'Authorization': `Bearer ${process.env.REACT_APP_BACKEND_API_TOKEN}` 
};

export const getAll = async () => {
    try {
        const res = await axios.get(`/api/elastic/getAll`, {headers});
        return res.data
    } catch (err) {
        console.error(err);
    }
};

export const getWithQuery = async (query) => {
    const params = {
        "index": "rsi",
       ...query,
    };
    try {
        const res = await axios.get(`/api/elastic/get`, {params, headers});
        return res.data
    } catch (err) {
        console.error(err);
    }
};