import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAggs } from '../../API';

const GetData = () => {
  const dispatch = useDispatch();

  const [data, setdata] = useState([])

  const getQuery = async () => {
    const query = {
        "asd": {
          "filters": {
            "filters": {
              "1": { "match": { "day_of_week": 1 } },
              "2": { "match": { "day_of_week": 2 } },
              "3": { "match": { "day_of_week": 3 } },
              "4": { "match": { "day_of_week": 4 } },
              "5": { "match": { "day_of_week": 5 } },
              "6": { "match": { "day_of_week": 6 } },
              "7": { "match": { "day_of_week": 7 } }
              }
          }
        }
    };
    
    const res = await getAggs(query);
    setdata(res.hits.hits);
  }

  return (
      <>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => getQuery()}>
            {' '}
            Get Data
        </Button>
        {
          data.length > 0 ? data.map(el => (
            <div key={el._id}>
              {el._source.country} {el._source.date}
            </div>
          )) : null
        }
      </>
  );
};

export default GetData;