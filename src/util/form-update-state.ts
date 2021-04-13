import { some, none } from "fp-ts/lib/Option";

export const formUpdateState = <T extends object>(state: T, setState: (newState: T) => void, formPropName: string) => (id: string, value: any) => {
	var newFormPart: any = {};
	const newValue = (String(value) == "") ? none : some(value);
	newFormPart[id] = newValue;

	var formPartOfState: any = {};
	formPartOfState[formPropName] = {
		...(<any>state)[formPropName],
		...newFormPart
	};
	

	setState({
		...state,
		...formPartOfState
	})
};

export const formUpdateStateHooks = <T extends object>(state: T, setState: (newState: T) => void) => (id: string, value: any) => {
	setState({
		...state,
		[id]: (String(value) == "") ? none : some(value)
	})
}
