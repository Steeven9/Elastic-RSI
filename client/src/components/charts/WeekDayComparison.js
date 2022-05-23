import React from "react";
import { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { getWithQuery } from "../../API";
import { useSelector } from "react-redux";

function dateToWeekDayIndex(date) {
    const index = date.getDay()
    return (index + 6) % 7
}

function dateToHourIndex(date) {
    return date.getHours()
}

function WeekDayComparison() {
    const [option, setOption] = useState(undefined);
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
            }: {}),
            aggs: {
                by_hour: {
                    date_histogram: {
                        field: "date",
                        calendar_interval: "hour"
                    }
                }
            },
            sort: [
                {
                    date: {
                        order: "asc"
                    }
                }
            ]
        }
        const response = await getWithQuery(query)
        let values = new Array(7 * 24).fill(0)
        const numberHours = response.aggregations.by_hour.buckets.length
        const startDate = new Date(response.aggregations.by_hour.buckets[0].key_as_string)
        const startWeekDayIndex = dateToWeekDayIndex(startDate)
        const startHourIndex = dateToHourIndex(startDate)
        let hourIndex = 24 * startWeekDayIndex + startHourIndex
        let hourCounter = new Array(7 * 24).fill(0)
        for (let i = 0; i < numberHours; i++) {
            values[hourIndex] += response.aggregations.by_hour.buckets[i].doc_count
            hourCounter[hourIndex] += 1
            hourIndex = (hourIndex + 1) % (7 * 24)
        }
        for (let i = 0; i < hourCounter.length; i++) {
            values[i] = values[i] / hourCounter[i]
        }
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const option = {
            grid: {
                left: '10%',
                right: '10%',
                containLabel: true
            },
            title: {
                text: 'Weekday comparison',
                left: 'center'
            },
            legend: {
                orient: 'vertical',
                right: '0%',
                top: 'middle'
            },
            tooltip: {
                trigger: 'item'
            },
            xAxis: {
                name: 'Day time',
                nameLocation: "middle",
                nameGap: 30,
                nameTextStyle: {
                    fontSize: 14,
                    fontWeight: 'bolder'
                },
                axisLabel: {
                    interval: 2
                },
                type: 'category',
                data: new Array(24).fill(0).map((_, i) => `${new String(i).padStart(2, '0')}:00`)
            },
            yAxis: {
                name: 'Number requests',
                nameLocation: 'middle',
                nameGap: 70,
                nameTextStyle: {
                    fontSize: 14,
                    fontWeight: 'bolder'
                },
                type: 'value'
            },
            series: days.map((dayName, dayIndex) => {
                return {
                    name: dayName,
                    type: 'line',
                    tooltip: {
                        formatter: (params) => `Day: ${params.seriesName} </br>Number requests: ${params.value} </br>Day time: ${params.name} - ${(parseInt(params.name.split(':')[0])+1).toString().padStart(2, '0')}:00`,
                        extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, 0);'
                    },
                    symbolSize: 4,
                    symbol: 'circle',
                    lineStyle: {
                        width: 1.5
                    },
                    data: values.slice(dayIndex * 24, dayIndex * 24 + 24)
                }
            })
        }
        setOption(option)
        console.log('now')
    }, [countryFilter, regionFilter])

    return (
        <div style={{
            aspectRatio: 2/1
        }}>
            {option ? (<ReactEcharts option={option} />) : (<div style={{ textAlign: "center" }}>Loading...</div>)}
        </div>
    )
        /*
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const hourLabels = new Array(24).fill(0).map((_, i) => `${new String(i).padStart(2, '0')}:00`)
        let result = {
            title: new Array(days.length),
            singleAxis: new Array(days.length),
            series: new Array(days.length),
            tooltip: {
                position: 'top'
            }
        }
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
            result.title[dayIndex] = {
                textBaseline: 'middle',
                top: `${((dayIndex + 0.5) * 100) / 7}%`,
                text: days[dayIndex]
            }
            result.singleAxis[dayIndex] = {
                left: 150,
                type: 'category',
                boundaryGap: false,
                data: hourLabels,
                top: `${(dayIndex * 100) / 7 + 5}%`,
                height: `${100 / 7 - 10}%`,
                axisLabel: {
                    interval: 2
                }
            }
            result.series[dayIndex] = {
                singleAxisIndex: dayIndex,
                coordinateSystem: 'singleAxis',
                type: 'scatter',
                symbolSize: (dataItem) => dataItem[1] / scatterPointScale,
                data: values.slice(dayIndex * 24, dayIndex * 24 + 24).map((e, i) => [i, e])
            }
        }
        setOption(result)
    */
} 

export default WeekDayComparison