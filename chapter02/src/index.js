import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import tsTest from "./tsTest";

import manifest from "./manifest.webapp";
import alien from "./alien.png";

tsTest("test");
console.log("alien", alien);
console.log("manifest", manifest);

function test() {
  console.log("test");
}

ReactDOM.render(<App />, document.getElementById("root"));
