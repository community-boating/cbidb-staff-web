import { combineReducers } from "redux";

import nav from "./navReducers";
import layout from "./layoutReducer";
import theme from "./themeReducer";

import { reducer as toastr } from "react-redux-toastr";

export default combineReducers({
	nav,
	layout,
	theme,
	toastr
});