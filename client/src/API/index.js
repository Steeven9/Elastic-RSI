import axios from 'axios';

const headers = {
    'Authorization': 'Bearer ciaomamma' 
};

export const getAll = () => {
    axios.get('https://elastic-rsi.soulsbros.ch/api/elastic/getAll', headers)
};