import * as types from "../constants";

const initialState = {
	isOpen: true,
	isAuto: true
};

export default function reducer(state = initialState, actions) {
	setTimeout(() => {
		window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))		
	}, 400);
	switch (actions.type) {
		case types.LAYOUT_DOCK_NAV_TOGGLE:
			return {
				...state,
				isOpen: !state.isOpen
			};
		case types.LAYOUT_DOCK_NAV_OPEN:
			return {
				...state,
				isOpen: true
			};
		case types.LAYOUT_DOCK_NAV_CLOSE:
			return {
				...state,
				isOpen: false
			};

		case types.LAYOUT_DOCK_NAV_AUTO_TOGGLE:
			return {
				...state,
				isAuto: !state.isAuto
			};
		case types.LAYOUT_DOCK_NAV_AUTO_ENABLE:
			return {
				...state,
				isAuto: true
			};
		case types.LAYOUT_DOCK_NAV_AUTO_DISABLE:
			return {
				...state,
				isAuto: false
			};

		default:
			return state;
	}
}
