import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";
import Loading from "../Loading";

function dateToWeekDayIndex(date) {
  const index = date.getDay();
  return (index + 6) % 7;
}

function getWeekDays() {
  return [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
}

const WeekDayCounts = () => {
  const [rows, setRows] = useState(undefined);
  const countryFilter = useSelector((st) => st.generalReducer.countryFilter);
  const regionFilter = useSelector((st) => st.generalReducer.regionFilter);

  useEffect(() => {
    async function fetchData() {
      const query = buildQuery(
        {
          country: countryFilter,
          admin1: regionFilter,
        },
        {
          aggs: {
            by_day: {
              date_histogram: {
                field: "ch_date",
                calendar_interval: "day",
              },
            },
          },
          sort: [
            {
              ch_date: {
                order: "asc",
              },
            },
          ],
        }
      );
      const response = await getWithQuery(query);
      let counts = new Array(7).fill(0);
      const numberDays = response.aggregations.by_day.buckets.length;
      const startDate = new Date(
        response.aggregations.by_day.buckets[0].key_as_string
      );
      let weekDayIndex = dateToWeekDayIndex(startDate);
      for (let i = 0; i < numberDays; i++) {
        counts[weekDayIndex] += 1;
        weekDayIndex = (weekDayIndex + 1) % 7;
      }
      const result = getWeekDays().map((dayName, dayIndex) => {
        return {
          name: dayName,
          count: counts[dayIndex],
        };
      });
      setRows(result);
    }
    fetchData();
  }, [countryFilter, regionFilter]);

  return (
    <div>
      {rows ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Weekday</b>
                </TableCell>
                <TableCell align="left">
                  <b>Number occurrences</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default WeekDayCounts;
