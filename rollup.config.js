import svelte from "rollup-plugin-svelte";
const path = require("path");

const getConfig = ({ file, output }) => ({
  input: `./src/${file}`,
  output: {
    format: "esm",
    file: output || file
  },
  plugins: [svelte({})],
  external: [
    "svelte",
    "svelte/internal",
    "svelte/store",
    "svelte/easing",
    "svelte/transition",
    "svelte/motion",
    "svelte-helpers/animation",
    "escape-string-regexp"
  ]
});

module.exports = [
  getConfig({ file: "spring-transitions.js" }),
  getConfig({ file: "modal.js", output: "Modal.js" }),
  getConfig({ file: "AutoSuggest.svelte", output: "AutoSuggest.js" })
];
