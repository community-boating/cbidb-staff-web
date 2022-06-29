import * as React from 'react'
import * as t from "io-ts";
import {accessStateValidator} from 'async/staff/access-state'

type AccessState = t.TypeOf<typeof accessStateValidator>;

export const ManagePermissionsPage = (props: {accessState: AccessState}) => {
	return <div>{JSON.stringify(props.accessState)}</div>;
}