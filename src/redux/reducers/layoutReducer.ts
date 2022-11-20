import * as types from "../constants";

const initialState = {
	isBoxed: false
};

export default function reducer(state = initialState, actions) {
	switch (actions.type) {
		case types.LAYOUT_BOXED_TOGGLE:
			return {
				...state,
				isBoxed: !state.isBoxed
			};
		case types.LAYOUT_BOXED_ENABLE:
			return {
				...state,
				isBoxed: true
			};
		case types.LAYOUT_BOXED_DISABLE:
			return {
				...state,
				isBoxed: false
			};

		default:
			return state;
	}
}
