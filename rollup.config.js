import svelte from "rollup-plugin-svelte";
const path = require("path");

const getConfig = ({ file, output }) => ({
  input: `./src/${file}`,
  output: {
    format: "esm",
    file: output || file
  },
  plugins: [svelte({})],
  external: ["svelte", "svelte/internal", "svelte/store", "svelte/easing", "svelte/transition", "svelte-helpers/animation"]
});

module.exports = [
  getConfig({ file: "spring-transitions.js" }),
  getConfig({ file: "Modal.svelte", output: "Modal.js" }),
  getConfig({ file: "AutoSuggest.svelte", output: "AutoSuggest.js" })
];
