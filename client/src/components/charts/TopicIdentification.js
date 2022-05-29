import React, { useEffect, useState } from "react";
import { getCount } from "../../API";
import Loading from "../Loading";

function TopicIdentification() {
    const [data, setData] = useState(undefined);

    const getData = async () => {
        let result = {};
        await Promise.all(
            ["identified", "unidentified"].forEach(async (entry) => {
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
        <div>
            {data ? (
                <div>data</div>
            ) : (<Loading />)}
        </div>
    );
}

export default TopicIdentification
