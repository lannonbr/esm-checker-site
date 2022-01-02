let entries = window.esmData;

let timesArr = [];
let exports_require_arr = [];
let exports_no_require_arr = [];
let type_module_arr = [];

for (const entry of entries) {
  timesArr.push(dayjs(entry.timestamp).valueOf());
  exports_require_arr.push(entry.exports_require);
  exports_no_require_arr.push(entry.exports_no_require);
  type_module_arr.push(entry.type_module);
}

var chart = bb.generate({
  bindto: "#esm-chart",
  data: {
    x: "x",
    columns: [
      ["x", ...timesArr],
      ["type_module", ...type_module_arr],
      ["exports_require", ...exports_require_arr],
      ["exports_no_require", ...exports_no_require_arr],
    ],
  },
  axis: {
    x: {
      tick: {
        format: function (d) {
          return dayjs(d).format("MMM/DD/YYYY");
        },
      },
    },
  },
  tooltip: {
    format: {
      title: function (d) {
        return dayjs(d).format("MMM/DD/YYYY");
      },
    },
  },
  size: {
    height: 400,
  },
  padding: {
    top: 20,
    right: 50,
    bottom: 20,
    left: 50,
  },
});
