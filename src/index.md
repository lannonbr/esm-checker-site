---
layout: main.html
title: ESM Checker - Home
---

# ES Module Checker Visualizations

This will show the last month of stats on how ES Module adoption is progressing on a day-to-day basis. This keeps track of approximately 2000 popular NPM packages which can be seen [here](https://github.com/lannonbr/esm-checker/blob/main/packages.txt).

{% statsGraph stats.monthStats %}

## Latest

<div style="display: flex; gap: 25px; text-align: center; justify-content: center;">
  <section>
    <span class="latest-text">{{stats.dayStats.timestamp}}</span><br>
    Date
  </section>
  <section>
    <span class="latest-text">{{stats.dayStats.exports_require}}</span><br>
    Exports Require
  </section>
  <section>
    <span class="latest-text">{{stats.dayStats.exports_no_require}}</span><br>
    Exports No Require
  </section>
  <section>
    <span class="latest-text">{{stats.dayStats.type_module}}</span><br>
    Type Module
  </section>
</div>

## Legend

- type_module: A module that explicitly set the type for the package to "module" which will treat all .js files as ESM by default.
- exports_require: A module that has an "exports" field that explicitly has a "require" field which allows a module to be required with a CJS fallback.
- exports_no_require: A module that has an "exports" field that does not have a "require" field, so it may not have a CJS fallback.

## Events

This is a collection of events of node modules enabling possible ESM features over the past 7 days.

<table id="audits">
    <thead>
      <tr>
        <th>Package</th>
        <th>timestamp</th>
        <th>changed field</th>
    </thead>
    <tbody>
  {% for audit in audits %}
<tr>
  <td><a href="https://npmjs.com/package/{{ audit.package_name }}">{{ audit.package_name }}</a></td>
  <td>{{ audit.timestamp }}</td>
  <td>{{ audit.change }} {% if audit.new_value == true %}enabled {% else %}disabled{% endif -%}</td>
</tr>
  {% endfor %}
  </tbody>
</table>
