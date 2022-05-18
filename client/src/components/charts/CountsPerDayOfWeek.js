const CountsPerDayOfWeek = (chartData) => {
  return (
    <ReactEcharts
      option={{
        grid: {
          left: "0%",
          containLabel: true,
        },
        title: {
          text: "Line chart",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            large: true,
            data: chartData,
            barWidth: "90%",
            tooltip: {
              formatter: (params) =>
                `Number requests: ${params.value} </br>Day time: ${params.name}`,
              extraCssText: "box-shadow: 0 0 0 rgba(0, 0, 0, 0);",
            },
          },
        ],
        toolbox: {
          right: 10,
        },
      }}
    />
  );
};

export default CountsPerDayOfWeek;
