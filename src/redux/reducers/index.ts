import { combineReducers } from "redux";

import layout from "./layoutReducer";
import theme from "./themeReducer";

import { reducer as toastr } from "react-redux-toastr";

export default combineReducers({
	layout,
	theme,
	toastr
});