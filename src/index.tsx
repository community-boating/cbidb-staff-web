import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import asc from "./app/AppStateContainer";
import { createBrowserHistory } from 'history';
import * as Sentry from '@sentry/browser';

require("./array-polyfill")

const sentryKey = (process.env.config as any).sentryDSN;
if (sentryKey) {
	Sentry.init({dsn: sentryKey});
}

export const history = createBrowserHistory()

ReactDOM.render(<App 
	history={history}
	asc={asc}
/>, document.getElementById("root"));