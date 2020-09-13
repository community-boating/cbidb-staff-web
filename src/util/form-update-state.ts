import { some, none } from "fp-ts/lib/Option";

const formUpdateState = <T extends object>(state: T, setState: (newState: T) => void, formPropName: string) => (id: string, value: any) => {
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

export default formUpdateState
