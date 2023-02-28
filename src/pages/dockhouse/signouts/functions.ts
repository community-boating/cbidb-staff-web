import { BoatTypesValidatorState, SignoutsTablesState } from 'async/staff/dockhouse/signouts';
import { Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";
import { DefaultDateTimeFormat } from 'util/OptionalTypeValidators';
import { ReassignedMapType } from './StateTypes';


export function makeReassignedMaps(activeSignouts: SignoutsTablesState, reassignedHullsMap: ReassignedMapType, reassignedSailsMap: ReassignedMapType) {
	activeSignouts.forEach((a) => { mapOptional(a.hullNumber, a.boatId, a.signoutId, reassignedHullsMap); });
	activeSignouts.forEach((a) => { mapOptional(a.sailNumber, a.boatId, a.signoutId, reassignedSailsMap); });
}

export function mapOptional(n: Option<string>, boatId: number, signoutId: number, b: { [key: string]: { [key: number]: number[]; }; }) {
	if (option.isSome(n)) {
		var val = (b[n.getOrElse("")] || {});
		val[boatId] = (val[boatId] || []).concat(signoutId);
		b[n.getOrElse("")] = val;
	}
}

export function makeBoatTypesHR(boatTypes: BoatTypesValidatorState) {
	return boatTypes.sort((a, b) => a.displayOrder - b.displayOrder).map((v) => ({ value: v.boatId, display: v.boatName }));
}
export function handleSingleSignIn(signoutId: number, isUndo: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void) {
	const signinDatetime = isUndo ? option.none : option.some(moment().format(DefaultDateTimeFormat));
	return Promise.reject();
	/*return putSignout.sendJson({ signoutId: signoutId, signinDatetime: signinDatetime }).then((a) => {
		if (a.type === "Success") {
			const newState = Object.assign([], state);
			for (var i = 0; i < newState.length; i++) {
				if (state[i].signoutId == signoutId) {
					newState[i] = Object.assign({}, state[i]);
					newState[i].signinDatetime = signinDatetime;
					break;
				}
			}
			setState(newState);
		}
	})*/
}
