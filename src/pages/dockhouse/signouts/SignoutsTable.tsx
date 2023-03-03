import * as React from 'react';
import { putSignout, SignoutsTablesState, SignoutTablesState, signoutValidator } from 'async/staff/dockhouse/signouts';
import TableWithModalForm, { TableWithModalFormAsync, TableWithModalFormAsyncRaw, UpdateStateType, wrapForFormComponents, wrapForFormComponentsMoment } from 'components/table/TableWithModalForm';
import { StringifiedProps } from 'util/StringifyObjectProps';
import { AmPmInput, HourInput, MinuteInput } from 'components/wrapped/Input';
import { option, state } from 'fp-ts';
import * as moment from "moment";
import { SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { FilterFnOption } from '@tanstack/react-table';
import { columnsActive, columnsInactive } from "./SignoutsColumnDefs";
import { InteractiveColumnInjector } from '../../../components/table/InteractiveColumnInjector';
import { Table } from 'components/table/Table';
import { SignoutsTablesExtraState } from './StateTypes';
import { ActionModalContext } from 'components/dockhouse/actionmodal/ActionModal';
import { EditSignoutAction } from "components/dockhouse/actionmodal/signouts/EditSignoutAction";

export const filterActive = (isActive) => isActive ? (a: SignoutTablesState) => option.isNone(a.signinDatetime) : (a: SignoutTablesState) => option.isSome(a.signinDatetime);

export const SignoutsTable = (props: {
	state: SignoutsTablesState
	setState: React.Dispatch<React.SetStateAction<SignoutsTablesState>>
	extraState: SignoutsTablesExtraState
	isActive: boolean
	filterValue: SignoutsTableFilterState
	globalFilter: FilterFnOption<SignoutTablesState>
	hiddenColumns?: string[]
}) => {
	const actionModal = React.useContext(ActionModalContext);
	const f = filterActive(props.isActive);
	const provider = React.useMemo(() => (new InteractiveColumnInjector(props.isActive ? columnsActive : columnsInactive)), [])
	var columns = React.useMemo(() => (provider.provideColumns(props.extraState)), [props.extraState, provider]);
	const filteredSignouts = props.state.filter(f);
	const openEditRow = (row: SignoutTablesState) => {
		actionModal.pushAction(new EditSignoutAction(row.signoutId));
	}
	return <>
		<Table<SignoutTablesState, SignoutsTableFilterState>
			globalFilter={props.globalFilter}
			globalFilterState={props.filterValue}
			rows={filteredSignouts}
			keyField="signoutId"
			columns={columns}
			openEditRow={openEditRow}
			/>
	</>;
};

export const ValidatedTimeInput: (props: { rowForEdit: any, updateState: UpdateStateType, validationResults, columnId: string, lower: moment.Moment, upper: moment.Moment }) => JSX.Element = (props) => {
	return <div className="flex flex-row">
		<div>
			<HourInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
		<div>
			<MinuteInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
		<div>
			<AmPmInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
	</div>;
}