import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { getCount } from "../../API";
import Loading from "../Loading";

function TopicIdentification() {
  const [data, setData] = useState(undefined);

  const getData = async () => {
    let result = {};
    await Promise.all(
      ["total", "identified"].map(async (entry) => {
        const query = {
          query: {
            bool: {
              must: [
                {
                  wildcard: {
                    "path.keyword": {
                      value: "/g/?*",
                    },
                  },
                },
              ],
              ...(entry === "identified"
                ? {
                    filter: [
                      {
                        script: {
                          script: "doc['topics'].length != 0",
                        },
                      },
                    ],
                  }
                : {}),
            },
          },
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
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <Typography variant="h6">
              {data.identified} / {data.total} (
              {100 * (data.identified / data.total).toFixed(3)} %)
            </Typography>
            <Typography color="gray">
              topics identified in requests to path /g/[ID]
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default TopicIdentification;
