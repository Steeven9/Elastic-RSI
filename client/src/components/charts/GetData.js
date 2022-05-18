import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getAggs } from "../../API";
import DayTimesComparison from './DayTimesComparison';
import Overview from "./Overview";

const GetData = () => {
  const dispatch = useDispatch();

  const [data, setdata] = useState([]);

  const getQuery = async () => {
    const query = {
      asd: {
        filters: {
          filters: {
            1: { match: { day_of_week: 1 } },
            2: { match: { day_of_week: 2 } },
            3: { match: { day_of_week: 3 } },
            4: { match: { day_of_week: 4 } },
            5: { match: { day_of_week: 5 } },
            6: { match: { day_of_week: 6 } },
            7: { match: { day_of_week: 7 } },
          },
        },
      },
    };

    const res = await getAggs(query);

    const resArray = Object.keys(res.asd.buckets).map((key) => {
      return res.asd.buckets[key].doc_count;
    });
    setdata(resArray);
  };

  return (
    <>
      {/* <Button variant="outlined" sx={{ margin: 1 }} onClick={() => getQuery()}>
        {" "}
        Get Data
      </Button>
      {data.length > 0 ? data.map((el) => <div key={el}>{el}</div>) : null} */}
       <Overview />
       <DayTimesComparison />
    </>
  );
};

export default GetData;
