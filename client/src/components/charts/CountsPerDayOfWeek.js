const CountsPerDayOfWeek = (data) => {
  return (
    <ReactEcharts
      onEvents={{
        dataZoom: onDataZoom,
      }}
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
          data: source.currentData.x.map((date) =>
            formatDate(date, source.currentTimeLevel)
          ),
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            large: true,
            data:
              typeof source.currentData != "undefined"
                ? source.currentData.y
                : [],
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
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            startValue: source.currentAxialIndices.start,
            endValue: source.currentAxialIndices.end,
          },
        ],
      }}
    />
  );
};

export default CountsPerDayOfWeek;
