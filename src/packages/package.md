---
layout: main.html
permalink:
  packages: "/packages/:package"
eleventyComputed:
  title: "Package {{ eleventy.serverless.path.package }} - ESM Checker"
---

## Package: {{ eleventy.serverless.path.package }}

## Details

<a href="{{ npmUrl }}">npm page</a>

Type Module: {{ dynamoData.type_module }}

Exports no require: {{ dynamoData.exports_no_require }}

Exports require: {{ dynamoData.exports_require }}

## Audits

{% if dynamoData.auditsLen > 0 %}

<table id="audits">
    <thead>
      <tr>
        <th>Package</th>
        <th>timestamp</th>
        <th>changed field</th>
    </thead>
    <tbody>
  {% for audit in dynamoData.audits %}
<tr>
  <td><a href="https://npmjs.com/package/{{ audit.package_name }}">{{ audit.package_name }}</a></td>
  <td>{{ audit.timestamp }}</td>
  <td>{{ audit.change }} {% if audit.new_value == true %}enabled {% else %}disabled{% endif -%}</td>
</tr>
  {% endfor %}
  </tbody>
</table>
{% else %}
<p>There are currently no recorded audits at the time for this package</p>
{% endif %}

Built on: {{ builtDate }}
