import React from "react";
import { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { getWithQuery } from "../../API";
import { useSelector } from "react-redux";

function UserAgentComparison() {

    const [data, setData] = useState(undefined)
    const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
    const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

    useEffect(async () => {
        const isCountrySelected = countryFilter !== 'Global'
        const isRegionSelected = regionFilter !== 'All'
        const query = {
            size: 0,
            ...(isCountrySelected || isRegionSelected ? {
                query: {
                    bool: {
                        must: [
                            ...(isCountrySelected ? [{
                                match: {
                                    country: countryFilter,
                                },
                            }] : []),
                            ...(isRegionSelected ? [{
                                match: {
                                    admin1: regionFilter,
                                },
                            }] : [])
                        ],
                    },
                }
            }: {})
        }
        const response = await getWithQuery(query)
        setData(result)
    }, [countryFilter, regionFilter])

    return (
        <ReactEcharts option={{

        }}/>
    )

}