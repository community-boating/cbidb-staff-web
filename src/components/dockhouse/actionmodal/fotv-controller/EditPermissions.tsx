import { FOTVContext } from "async/providers/FOTVProvider";
import { FOTVType, RestrictionConditionType, RestrictionGroupType, UserType, changePasswordWrapper, deleteRestrictionGroup } from "async/staff/dockhouse/fotv-controller";
import { Action, getInfo, subStateWithSet } from "components/dockhouse/actionmodal/ActionModalProps"
import { ModalContext, ModalHeader } from "components/wrapped/Modal";
import { Dispatch, ReactNode } from "react"

import * as React from 'react';
import { mergeTable } from "../../../../pages/dockhouse/fotv-controller/shared";
import { AppStateContext } from "app/state/AppStateContext";
import { UsersContext } from "async/providers/UsersProvider";
import { PermissionsContext } from "async/providers/PermissionsProvider";
import ActionBasedEditor, { EditAction } from "components/ActionBasedEditor";
import { SimpleInput } from "components/wrapped/Input";
import { PERMISSIONS } from "models/permissions";

type EditPermissionsType = {
    userID: number
}

export type EditPermissionsInfo = {
    userID: number 
    permissions: number[]
    onComplete: () => void
    //setRestrictionGroup: React.Dispatch<React.SetStateAction<RestrictionGroupType[]>>
}

function EditPermissionsModal(props: {info: EditPermissionsInfo}){
    const modal = React.useContext(ModalContext);
    const [actions, setActions] = React.useState([]);
    const allPermissions = Object.entries(PERMISSIONS)
    const permissionsByKey = {};
    console.log(props.info.permissions)
    props.info.permissions.forEach((a) => {
        permissionsByKey[a] = true
    })
    console.log(props.info.permissions)
    //const [username, setUsername] = React.useState(props.info.user.username);
    //const [password, setPassword] = React.useState(props.info.user.password);
    return <div className='flex flex-col w-[75vw]'>
        <ModalHeader>
            Edit Permissions
        </ModalHeader>
        <ActionBasedEditor actions={actions} setActions={setActions} originalData={props.info} makeChildren={(currentData, actions) => {
            return <div className='w-full h-full'>
                <ul>
                    {allPermissions.map((a) => <li><label>{a[0]}</label><input type="checkbox" checked={permissionsByKey[a[1]] == true} onChange={(e) => {e.preventDefault();
                        if(e.target.checked){
                            console.log("WHAT")
                            console.log(a[0])
                            setActions((b) => b.concat(new AddPermissionAction(a[1])))
                        }
                    }}/></li>)}
                </ul>
            </div>
        }}/>
    </div>
}

class DeletePermissionAction extends EditAction<EditPermissionsInfo>{
    permissionKey: number;
    delete = true;
    constructor(permissionKey: number){
        super();
        this.permissionKey = permissionKey;
    }
    applyActionLocal(data) {
        return {...data, permissions: data.permissions.filter((a) => a != this.permissionKey)};
    }
}

class AddPermissionAction extends EditAction<EditPermissionsInfo>{
    permissionKey: number;
    delete = false;
    constructor(permissionKey: number){
        super();
        this.permissionKey = permissionKey;
    }
    applyActionLocal(data) {
        console.log("APPLYING");
        console.log(data);
        console.log(this.permissionKey)
        return {...data, permissions: data.permissions.concat(this.permissionKey)};
    }
}

export default class ActionEditPermissions extends Action<EditPermissionsInfo, any>{
    constructor(userID: number){
        super();
        this.initState = {};
        this.modeInfo = () => {
            const permissions = React.useContext(PermissionsContext);
            //const restrictionGroupSet = subStateWithSet(fotv.state, fotv.setState, 'restrictionGroups')[1];
            //const user = users.state.find((a) => a.userID == userID) || {username: "", userID: -1}
            return ({
                userID: userID,
                permissions: permissions.state.filter((a) => a.userID == userID).map((a) => a.permissionKey),
                onComplete: () => alert("TODO")});
        }
    }
    createModalContent(info: EditPermissionsInfo, state: any, setState: Dispatch<any>, isDLV: boolean): ReactNode {
        return <EditPermissionsModal info={getInfo(info)}/>
    }

}