import { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getWithQuery } from "../../API";

function dateToWeekDayIndex(date) {
    const index = date.getDay()
    return (index + 6) % 7
}

function WeekDayCounts() {

    const [rows, setRows] = useState(undefined)
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
            } : {}),
            aggs: {
                by_day: {
                    date_histogram: {
                        field: "date",
                        calendar_interval: "day",
                    },
                },
            },
            sort: [
                {
                    date: {
                        order: "asc",
                    },
                },
            ],
        }
        const response = await getWithQuery(query)
        let counts = new Array(7).fill(0)
        const numberDays = response.aggregations.by_day.buckets.length
        const startDate = new Date(response.aggregations.by_day.buckets[0].key_as_string)
        const weekDayIndex = dateToWeekDayIndex(startDate)
        for (let i = 0; i < numberDays; i++) {
            counts[weekDayIndex] += 1
            weekDayIndex = (weekDayIndex + 1) % 7
        }
        const result = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, dayIndex) => {
            return {
                name: dayName,
                count: counts[dayIndex]
            }
        })
        setRows(result)
    }, [countryFilter, regionFilter])

    return (
        <div>
            {
                rows ? (
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Week day</TableCell>
                                    <TableCell align="right">Number occurences</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (<div style={{ textAlign: "center" }}>Loading...</div>)
            }
        </div>);
}

export default WeekDayCounts