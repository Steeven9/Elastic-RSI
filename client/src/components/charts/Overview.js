import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Fragment } from 'react'
import ReactEcharts from "echarts-for-react"
import { getWithQuery } from '../../API'

function Overview() {

    const [baseData, setBaseData] = useState(undefined)
    const [source, setSource] = useState(undefined)
    const sourceReference = useRef()
    sourceReference.current = source
    const baseDataReference = useRef()
    baseDataReference.current = baseData

    useEffect(async () => {
        const numberPages = 10
        const pageSize = 10000
        let result = {
            x: {
                start: undefined,
                end: undefined
            },
            y: new Array()
        }
        let sort_index
        for (let p = 0; p < numberPages; p++) {
            const query = {
                "size": pageSize,
                "query": {
                    "match_all": {}
                },
                "fields": [
                    "date"
                ],
                "_source": false,
                "sort": [
                    {
                        "date": {
                            "order": "asc"
                        }
                    }
                ],
                ...(p > 0 && {search_after: [sort_index]})
            }
            const response = await getWithQuery(query)
            const numberHits = response.hits.hits.length
            const start = new Date(response.hits.hits[0].fields.date[0])
            const end = new Date(response.hits.hits[numberHits - 1].fields.date[0])
            const numberSeconds = (end.getTime() - start.getTime()) / 1000 + 1
            let counter = new Array(numberSeconds).fill(0)
            for (let i = 0; i < numberHits; i++) {
                const date = new Date(response.hits.hits[i].fields.date[0])
                const index = (date.getTime() - start.getTime()) / 1000
                counter[index] += 1
            }
            if (p === 0) {
                result.x.start = start
            }
            if (p === numberPages - 1) {
                result.x.end = end
            }
            result.y = result.y.concat(counter)
            sort_index = response.hits.hits[numberHits - 1].sort[0]
        }
        setBaseData(result)
    }, [])

    useEffect(() => {
        if (typeof baseData !== 'undefined') {
            const dayRange = getDayRange(baseData.x.start, baseData.x.end)
            const numberDays = getDayDifference(dayRange) + 1
            const hourRange = getHourRange(baseData.x.start, baseData.x.end)
            const numberHours = getHourDifference(hourRange) + 1
            drillUpToDays(baseData).then(dataPerDay => {
                setSource({
                    currentData: dataPerDay,
                    currentTimeLevel: 'days',
                    currentAxialIndices: {
                        start: 0,
                        end: numberDays
                    },
                    timeLevelRanges: {
                        base: {
                            days: {
                                start: dayRange.start,
                                end: dayRange.end
                            },
                            hours: {
                                start: hourRange.start,
                                end: hourRange.end
                            }
                        }
                    },
                    timeLevelIndices: {
                        base: {
                            days: {
                                start: 0,
                                end: numberDays
                            },
                            hours: {
                                start: 0,
                                end: numberHours
                            }
                        }
                    }
                })
            })
        }
    }, [baseData])

    function isDrillingDownFromDaysToHours(currentsource, indexRange) {
        return currentsource.currentTimeLevel === 'days' && (currentsource.timeLevelIndices.base.days.start <= indexRange.start && indexRange.end <= currentsource.timeLevelIndices.base.days.end)
    }

    function isDrillingDownFromHoursToMinutes(currentsource, indexRange) {
        return currentsource.currentTimeLevel === 'hours' && (currentsource.timeLevelIndices.base.hours.start <= indexRange.start && indexRange.end <= currentsource.timeLevelIndices.base.hours.end)
    }

    function isDrillingUpFromHoursToDays(currentsource, indexRange) {
        return currentsource.currentTimeLevel === 'hours' && (typeof indexRange.start === 'undefined' && typeof indexRange.end === 'undefined')
    }

    function isDrillingUpFromMinutesToHours(currentsource, indexRange) {
        return currentsource.currentTimeLevel === 'minutes' && (indexRange.start === currentsource.timeLevelIndices.days.start && indexRange.end === currentsource.timeLevelIndices.days.end)
    }

    const onDataZoom = useCallback((params) => {
        const indexRange = {
            start: params.batch[0].startValue,
            end: params.batch[0].endValue
        }
        if (isDrillingDownFromDaysToHours(sourceReference.current, indexRange)) {
            const start = new Date(sourceReference.current.timeLevelRanges.base.days.start.getTime() + (indexRange.start - sourceReference.current.timeLevelIndices.base.days.start) * 24 * 60 * 60 * 1000)
            const end = new Date(start.getTime() + (indexRange.end - indexRange.start) * 24 * 60 * 60 * 1000)
            const dayRange = {
                start: start,
                end: end
            }
            drillUpToHours(baseDataReference.current, dayRange).then(dataPerHour => {
                setSource(source => {
                    let newSource = {
                        ...source,
                        currentData: dataPerHour,
                        currentTimeLevel: 'hours',
                        currentAxialIndices: {
                            start: 0,
                            end: dataPerHour.x.length
                        }
                    }
                    newSource.timeLevelRanges.days = dayRange
                    newSource.timeLevelIndices.days = indexRange
                    return newSource
                })
            })
        }
        if (isDrillingDownFromHoursToMinutes(sourceReference.current, indexRange)) {
            const start = new Date(indexRange.start * 60 * 60 * 1000 + sourceReference.current.currentData.x[0].getTime())
            const end = new Date((indexRange.end - indexRange.start) * 60 * 60 * 1000 + start.getTime())
            const hourRange = {
                start: start,
                end: end
            }
            drillUpToMinutes(baseDataReference.current, hourRange).then(dataPerMinute => {
                setSource(source => {
                    let newSource = {
                        ...source,
                        currentData: dataPerMinute,
                        currentTimeLevel: 'minutes',
                        currentAxialIndices: {
                            start: 0,
                            end: dataPerMinute.x.length
                        }
                    }
                    newSource.timeLevelRanges.hours = hourRange
                    newSource.timeLevelIndices.hours = indexRange
                    return newSource
                })
            })
        }
        if (isDrillingUpFromHoursToDays(sourceReference.current, indexRange)) {
            drillUpToDays(baseDataReference.current).then(dataPerDay => {
                setSource(source => {
                    let newSource = {
                        ...source,
                        currentData: dataPerDay,
                        currentTimeLevel: 'days',
                        currentAxialIndices: {
                            start: sourceReference.current.timeLevelIndices.base.days.start,
                            end: sourceReference.current.timeLevelIndices.base.days.end
                        }
                    }
                    return newSource
                })
            })
        }
        if (isDrillingUpFromMinutesToHours(sourceReference.current, indexRange)) {
            const dayRange = {
                start: sourceReference.current.timeLevelRanges.days.start,
                end: sourceReference.current.timeLevelRanges.days.end
            }
            drillUpToHours(baseDataReference.current, dayRange).then(dataPerHour => {
                setSource(source => {
                    let newSource = {
                        ...source,
                        currentData: dataPerHour,
                        currentTimeLevel: 'hours',
                        currentAxialIndices: {
                            start: 0,
                            end: dataPerHour.x.length
                        }
                    }
                    return newSource
                })
            })
        }
    }, [])

    return (
        <Fragment>
            {(typeof source !== 'undefined') &&
                <ReactEcharts
                    onEvents={{
                        dataZoom: onDataZoom
                    }}
                    option={{
                        grid: {
                            left: '0%',
                            containLabel: true
                        },
                        title: {
                            text: 'Overview',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        xAxis: {
                            data: source.currentData.x.map(date => formatDate(date, source.currentTimeLevel))
                        },
                        yAxis: {},
                        series: [
                            {
                                type: 'bar',
                                large: true,
                                data: typeof source.currentData != 'undefined' ? source.currentData.y : [],
                                barWidth: '90%',
                                tooltip: {
                                    formatter: (params) => `Number requests: ${params.value} </br>Day time: ${params.name}`,
                                    extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, 0);'
                                },
                            }
                        ],
                        toolbox: {
                            right: 10,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                }
                            }
                        },
                        dataZoom: [{
                            type: 'inside',
                            startValue: source.currentAxialIndices.start,
                            endValue: source.currentAxialIndices.end
                        }]
                    }} />}
        </Fragment>
    )
}

export default Overview

// helper functions

function formatDate(date, timeLevel) {
    if (timeLevel === 'days') {
        const d = date.toLocaleString()
        const year = d.split(', ')[0].split('/')[2]
        const month = d.split(', ')[0].split('/')[1]
        const day = d.split(', ')[0].split('/')[0]
        const result = `${day}-${month}-${year}`
        return result
    }
    if (timeLevel === 'hours') {
        const d = date.toLocaleString()
        const year = d.split(', ')[0].split('/')[2]
        const month = d.split(', ')[0].split('/')[1]
        const day = d.split(', ')[0].split('/')[0]
        const hours = d.split(', ')[1].split(':')[0]
        const result = `${day}-${month}-${year} \n${hours}:00`
        return result
    }
    if (timeLevel === 'minutes') {
        const d = date.toLocaleString()
        const year = d.split(', ')[0].split('/')[2]
        const month = d.split(', ')[0].split('/')[1]
        const day = d.split(', ')[0].split('/')[0]
        const hours = d.split(', ')[1].split(':')[0]
        const minutes = d.split(', ')[1].split(':')[1]
        const result = `${day}-${month}-${year} \n${hours}:${minutes}`
        return result
    }
}

function getDayRange(startTime, endTime) {
    const start = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        0, 0, 0
    )
    const end = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        0, 0, 0
    )
    return {
        start: start,
        end: end
    }
}

function getHourRange(startTime, endTime) {
    const start = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        startTime.getHours(),
        0, 0
    )
    const end = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        endTime.getHours(),
        0, 0
    )
    return {
        start: start,
        end: end
    }
}

function getDayDifference(dayRange) {
    return (dayRange.end.getTime() - dayRange.start.getTime()) / (24 * 60 * 60 * 1000)
}

function getHourDifference(hourRange) {
    return (hourRange.end.getTime() - hourRange.start.getTime()) / (60 * 60 * 1000)
}

// drill functions

async function drillUpToMinutes(baseData, hourRange) {
    const startTime = new Date(Math.max(baseData.x.start.getTime(), hourRange.start.getTime()))
    const startIndex = (startTime.getTime() - baseData.x.start.getTime()) / 1000
    const endTime = new Date(Math.min(hourRange.end.getTime() + 60 * 60 * 1000, baseData.x.end.getTime()))
    const endIndex = startIndex + (endTime.getTime() - startTime.getTime()) / 1000
    const numberMinutes = ((endTime.getTime() - endTime.getSeconds() * 1000) - (startTime.getTime() - startTime.getSeconds() * 1000)) / (60 * 1000) + 1
    let y = Array(numberMinutes).fill(0)
    let secondsIndex = 0
    for (let i = startIndex; i < endIndex; i++) {
        y[Math.floor(secondsIndex / 60)] += baseData.y[i]
        secondsIndex += 1
    }
    return {
        x: Array(y.length).fill(0).map((_, i) => new Date(startTime.getTime() + i * 60 * 1000)),
        y: y
    }
}

async function drillUpToHours(baseData, dayRange) {
    const startTime = new Date(Math.max(baseData.x.start.getTime(), dayRange.start.getTime()))
    const startIndex = (startTime.getTime() - baseData.x.start.getTime()) / 1000
    const endTime = new Date(Math.min(dayRange.end.getTime() + 24 * 60 * 60 * 1000, baseData.x.end.getTime()))
    const endIndex = startIndex + (endTime.getTime() - baseData.x.start.getTime()) / 1000
    const numberHours = ((endTime.getTime() - endTime.getMinutes() * 60 * 1000 - endTime.getSeconds() * 1000) - (startTime.getTime() - startTime.getMinutes() * 60 * 1000 - startTime.getSeconds() * 1000)) / (60 * 60 * 1000) + 1
    let y = Array(numberHours).fill(0)
    let secondsIndex = 0
    for (let i = startIndex; i < endIndex; i++) {
        y[Math.floor(secondsIndex / (60 * 60))] += baseData.y[i]
        secondsIndex += 1
    }
    return {
        x: Array(y.length).fill(0).map((_, i) => new Date(startTime.getTime() + i * 60 * 60 * 1000)),
        y: y
    }
}

async function drillUpToDays(baseData) {
    const dayRange = getDayRange(baseData.x.start, baseData.x.end)
    let numberDays = getDayDifference(dayRange) + 1
    let y = Array(numberDays).fill(0)
    let secondsIndex = (baseData.x.start.getTime() - dayRange.start.getTime()) / 1000
    for (let i = 0; i < baseData.y.length; i++) {
        y[Math.floor(secondsIndex / (24 * 60 * 60))] += baseData.y[i]
        secondsIndex += 1
    }
    return {
        x: Array(y.length).fill(0).map((_, i) => new Date(dayRange.start.getTime() + i * 24 * 60 * 60 * 1000)),
        y: y
    }
}