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

document.getElementById("audits").innerHTML = `
  <h2>Events</h2>
  <p>This is a collection of events of node modules enabling possible ESM features over the past 7 days.</p>
  <table>
    <thead>
      <tr>
        <th>Package</th>
        <th>timestamp</th>
        <th>changed field</th>
    </thead>
    <tbody>
  ${window.auditsData
    .map((e) => {
      return `<tr>
      <td>${e.package_name}</td>
      <td>${e.timestamp}</td>
      <td>${
        e.change + " " + (e.new_value === true ? "enabled" : "disabled")
      }</td>  
    </tr>`;
    })
    .join("")}
  </table>
`;
