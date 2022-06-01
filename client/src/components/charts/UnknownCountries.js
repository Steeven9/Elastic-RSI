import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { getCount } from "../../API";
import Loading from "../Loading";

function UnknownCountries() {
  const [data, setData] = useState(undefined);

  const getData = async () => {
    let result = {};
    await Promise.all(
      ["total", "unknown"].map(async (entry) => {
        const query = {
          ...(entry === "total"
            ? {
                query: {
                  match_all: {},
                },
              }
            : {
                query: {
                  bool: {
                    must: [
                      {
                        term: {
                          country: {
                            value: "unknown",
                          },
                        },
                      },
                    ],
                  },
                },
              }),
        };
        const count = await getCount(query);
        result[entry] = count;
      })
    );
    setData(result);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {data ? (
        <Card sx={{ width: "40%" }}>
          <CardContent>
            <Typography variant="h6">
              {data.unknown} / {data.total} (
              {100 * (data.unknown / data.total).toFixed(3)} %)
            </Typography>
            <Typography color="gray">
              Requests from unknown countries
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default UnknownCountries;
