let data = window.data;
let labels = data.map((d) => d.timestamp);

let max = moment
  .unix(Math.max(...data.map((d) => moment(d.timestamp, "YYYY-MM-DD").unix())))
  .add(1, "day")
  .format("YYYY-MM-DD");
let min = moment
  .unix(Math.min(...data.map((d) => moment(d.timestamp, "YYYY-MM-DD").unix())))
  .subtract(1, "day")
  .format("YYYY-MM-DD");

let ctx = document.getElementById("statsGraph").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Exports Require",
        data: data.map((d) => d.exports_require),
        borderColor: "#ff7f0e",
        borderWidth: 2,
      },
      {
        label: "Exports No Require",
        data: data.map((d) => d.exports_no_require),
        borderColor: "#2ca02c",
        borderWidth: 2,
      },
      {
        label: "Type Module",
        data: data.map((d) => d.type_module),
        borderColor: "#2077b4",
        borderWidth: 2,
      },
    ],
  },
  options: {
    elements: {
      point: {
        radius: 5,
        hitRadius: 20,
      },
    },
    interaction: {
      mode: "x",
    },
    scales: {
      x: {
        type: "timeseries",
        time: {
          unit: "day",
          parser: "YYYY-MM-DD",
        },
        min: min,
        max: max,
      },
      y: {
        beginAtZero: true,
      },
    },
  },
});
