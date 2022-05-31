import * as React from 'react';
import { Column } from "react-table"
import { Input } from "reactstrap"

export const DropDownCell = (values: {key: any, display: string}[]) => ( {
	value: initialValue,
	row: { index },
	column,
	updateMyData,
}) => {
	// We need to keep and update the state of the cell normally
	const [value, setValue] = React.useState(initialValue)

	const onChange = e => {
		setValue(e.target.value)
		updateMyData(index, column.id, e.target.value)
	}

	// If the initialValue is changed external, sync it up with our state
	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	return <Input
		type="select"
		id="exampleCustomSelect"
		name="customSelect"
		value={value || ""}
		onChange={onChange}
	>
		<option value={""}>-</option>
		{values.map((v, i) => <option value={v.key} key={`option_${i}`}>{v.display}</option> )}
	</Input>;
}