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

  return {
    dir: {
      input: "src",
    },
  };
};
