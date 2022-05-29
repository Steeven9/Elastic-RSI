import React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getWithQuery } from "../../API";
import buildQuery from "../../utils/query";
import { useSelector } from "react-redux";
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

function WeekDayCounts() {
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {rows ? (
        <TableContainer sx={{ width: "25%" }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Week day</b>
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
                  <TableCell align="center">{row.count}</TableCell>
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
}

export default WeekDayCounts;
