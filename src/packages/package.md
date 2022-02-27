---
layout: main.html
permalink:
  packages: "/packages/:package"
eleventyComputed:
  title: "Package {{ eleventy.serverless.path.package }} - ESM Checker"
---

# Package: {{ eleventy.serverless.path.package }}

<a href="/">Back to Home</a>

<a href="{{ npmUrl }}">npm page</a>

Type Module: {{ dynamoData.type_module }}

Exports no require: {{ dynamoData.exports_no_require }}

Exports require: {{ dynamoData.exports_require }}

Built on: {{ builtDate }}
