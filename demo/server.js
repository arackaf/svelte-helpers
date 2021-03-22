import express, { response } from "express";
const app = express();

import path from "path";
import fs from "fs";

import "svelte/register";
import { get } from "svelte/store";

//const App = require("./src/AppServer.svelte").default;
//const SSRWrapperComponent = require("./src/SSRWrapper.svelte").default;
//const SSRPrime = require("./src/SSRPrime.svelte").default;
//import cachePrime from "./src/serverSideCachePrime";
//import makeCachePrimer from "./src/serverSideCachePrime";

// const SSRWrapper = Component => {
//   Component.render = props => {
//     let cachePrimer = makeCachePrimer();

//     const { html, css, head } = SSRWrapperComponent.render({ Component, cachePrimer });
//     const { head: headAddon } = SSRPrime.render({ cachePrimer });

//     return { html, css, head: head + headAddon };
//   };
//   return Component;
// };

// const WrappedApp = SSRWrapper(App);

const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

const statics = ["/static/", "/node_modules/", "/dist/"];
statics.forEach(folder => app.use(folder, express.static(__dirname + folder)));

const modules = [""];
modules.forEach(name => app.get("/" + name, browseToSvelte));

//app.get("/server", (req, res) => res.sendFile(path.join(__dirname + "/dist/indexServer.html")));

// app.get("/server", (req, res) => {
//   //res.sendFile(path.join(__dirname + "/dist/indexServer.html"));
//   //return;
//   const file = fs.readFileSync(path.resolve(__dirname, "dist", "indexServer.html"), "utf8");
//   const { html, css, head } = WrappedApp.render({});

//   res.writeHead(200, { "Content-Type": "text/html" });
//   res.write(file.replace(`<div id="home"></div>`, `<div id="home">${html}</div>`).replace("</head>", `${head}</head>`));
//   res.end();
// });

function browseToSvelte(request, response) {
  response.sendFile(path.join(__dirname + "/dist/index.html"));
}

process.on("exit", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  process.exit();
}

app.listen(8083);

console.log("PORT 8083")

export default null;

