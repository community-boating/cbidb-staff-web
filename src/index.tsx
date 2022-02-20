import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import asc from "./app/AppStateContainer";
import { createBrowserHistory } from 'history';

require("./array-polyfill")

export const history = createBrowserHistory()

ReactDOM.render(<App 
	history={history}
	asc={asc}
/>, document.getElementById("root"));

console.log("git commit: $$GITHUB_SHA$$");
