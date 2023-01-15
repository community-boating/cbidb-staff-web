import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { createBrowserHistory } from 'history';
import * as Sentry from '@sentry/browser';
import { defaultAppState } from "app/state/AppStateContext";

require("./array-polyfill")

const sentryKey = (process.env.config as any).sentryDSN;
if (sentryKey) {
	Sentry.init({dsn: sentryKey});
}

export const history = createBrowserHistory()

ReactDOM.render(<App 
	history={history}
	asc={defaultAppState}
/>, document.getElementById("root"));