const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

require("dayjs");
require("@aws-sdk/client-dynamodb");
require("@aws-sdk/lib-dynamodb");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addShortcode("statsGraph", (data) => {
    return `
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/moment@^2"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@^1"></script>
<canvas id="statsGraph"></canvas>
<script>
window.data = ${JSON.stringify(data)};
</script>
<script src="/scripts/chart.js"></script>
`;
  });
  eleventyConfig.addFilter("persistSlash", (value) => {
    return value.replace(/\//, "%2F");
  });
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "packages",
    functionsDir: "./netlify/functions",
    redirects: "netlify-toml-builders",
  });

  return {
    dir: {
      input: "src",
    },
  };
};
