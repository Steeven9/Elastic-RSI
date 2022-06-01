import { getWithQuery } from "../API";
import buildQuery from "./query";

const dateToWeekDayIndex = (date) => {
  const index = date.getDay();
  return (index + 6) % 7;
};

const getDayOfWeekCount = async (
  countryFilter,
  regionFilter,
  topicFilter,
  deviceFilter
) => {
  const query = buildQuery(
    {
      country: countryFilter,
      admin1: regionFilter,
      topics: topicFilter,
      user_agent: deviceFilter,
    },
    {
      size: 0,
      aggs: {
        by_day: {
          date_histogram: {
            field: "local_date",
            calendar_interval: "day",
          },
        },
      },
      sort: [
        {
          local_date: {
            order: "asc",
          },
        },
      ],
    }
  );
  const response = await getWithQuery(query);
  const counts = new Array(7).fill(0);
  const numberDays = response.aggregations.by_day.buckets.length;
  if (numberDays > 0) {
    const startDate = new Date(
      response.aggregations.by_day.buckets[0].key_as_string
    );
    let weekDayIndex = dateToWeekDayIndex(startDate);
    for (let i = 0; i < numberDays; i++) {
      counts[weekDayIndex] += 1;
      weekDayIndex = (weekDayIndex + 1) % 7;
    }
  }
  return counts;
};

export default getDayOfWeekCount;
