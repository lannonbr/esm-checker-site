---
layout: main.html
title: ESM Checker - Home
---

## NOTICE

The site is no longer being updated and considered deprecated as of March 2023. See post here on why: [ESM Checker Postmortem](https://lannonbr.com/blog/esm-checker-postmortem/).

This will show the last month of stats on how ES Module adoption is progressing on a day-to-day basis. This keeps track of approximately 2000 popular NPM packages which can be explored in the [Package Listing](/package-listing/) page on this site.

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

{% if audits.auditsLen > 0 %}

This is a collection of events of node modules enabling possible ESM features over the past 7 days.

<table id="audits">
    <thead>
      <tr>
        <th>Package</th>
        <th>timestamp</th>
        <th>changed field</th>
    </thead>
    <tbody>
  {% for audit in audits.audits %}
<tr>
  <td><a href="/packages/{{ audit.package_name | persistSlash }}">{{ audit.package_name }}</a></td>
  <td>{{ audit.timestamp }}</td>
  <td>{{ audit.change }} {% if audit.new_value == true %}enabled {% else %}disabled{% endif -%}</td>
</tr>
  {% endfor %}
  </tbody>
</table>

{% else %}

No changes have happened in the last 7 days.

{% endif %}
