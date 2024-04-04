import { FOTVContext } from "async/providers/FOTVProvider";
import { Action, getInfo, subStateWithSet } from "components/dockhouse/actionmodal/ActionModalProps"
import { ModalCloseButton, ModalContext, ModalHeader } from "components/wrapped/Modal";
import { Dispatch, ReactNode } from "react"

import * as React from 'react';
import { mergeTable } from "../../../../pages/dockhouse/fotv-controller/shared";
import { AppStateContext } from "app/state/AppStateContext";
import { UsersContext } from "async/providers/UsersProvider";
import { PermissionsContext } from "async/providers/PermissionsProvider";
import ActionBasedEditor, { EditAction } from "components/ActionBasedEditor";
import { SimpleInput } from "components/wrapped/Input";
import { PERMISSIONS } from "models/permissions";
import { PermissionType, grantPermissionWrapper, permissionChangeType, permissionValidator, revokePermissionWrapper } from "async/staff/dockhouse/fotv-controller";
import APIWrapper from "core/APIWrapper";
import * as t from 'io-ts';

type EditPermissionsType = {
    userID: number
}

export type EditPermissionsInfo = {
    userID: number 
    permissions: number[]
    onComplete: () => void
    //setRestrictionGroup: React.Dispatch<React.SetStateAction<RestrictionGroupType[]>>
}

function getPermissionsByKey(info: EditPermissionsInfo){
    const permissionsByKey: {[key: number]: true} = {};
    info.permissions.forEach((a) => {
        permissionsByKey[a] = true
    })
    return permissionsByKey
}

function EditPermissionsModal(props: {info: EditPermissionsInfo}){
    const modal = React.useContext(ModalContext)
    const permissions = React.useContext(PermissionsContext)
    const asc = React.useContext(AppStateContext)
    const users = React.useContext(UsersContext)
    const [actions, setActions] = React.useState([])
    const allPermissions = Object.entries(PERMISSIONS).filter((a) => a[1] <= 100)
    //const [username, setUsername] = React.useState(props.info.user.username);
    //const [password, setPassword] = React.useState(props.info.user.password);
    return <div className='flex flex-col w-[75vw]'>
        <ModalHeader>
            Edit Permissions
        </ModalHeader>
        <ActionBasedEditor actions={actions} setActions={setActions} originalData={props.info} makeChildren={(currentData, actionsInt) => {
            const permissionsByKey = getPermissionsByKey(currentData)
            return <div className='w-full h-full'>
                <table>
                    <tbody>
                        {allPermissions.map((a, i) => <tr key={i}>
                            <td>
                                <label>
                                    {a[0]}
                                </label>
                            </td>
                            <td>
                                <input type="checkbox" checked={(permissionsByKey[a[1]] == true)} onChange={(e) => {
                                    if(e.target.checked){
                                        actionsInt.addAction(new AddPermissionAction(a[1]))
                                    }else{
                                        actionsInt.addAction(new DeletePermissionAction(a[1]))
                                    }
                            }}/>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <div className='flex flex-row gap-2'>
                    <ModalCloseButton/>
                    <button className='w-fit bg-red-500 text-white font-bold py-2 px-4 rounded mr-0 ml-auto' onClick={(v) => {
                        const permsToGrantMap: {[key: number]: number} = {}
                        const permsToRevokeMap: {[key: number]: number}  = {}
                        actions.forEach((a) => {
                            if(isAddAction(a)){
                                permsToGrantMap[a.permissionKey] = a.permissionKey
                                delete permsToRevokeMap[a.permissionKey]
                            }
                            if(isDeleteAction(a)){
                                permsToRevokeMap[a.permissionKey] = a.permissionKey
                                delete permsToGrantMap[a.permissionKey]
                            }
                        })
                        const permsToGrant = Object.values(permsToGrantMap)
                        const permsToRevoke = Object.values(permsToRevokeMap)
                        const b = t.array(permissionValidator)
                        const grantOrRevoke = (perms: number[], wrapper: APIWrapper<typeof b, typeof permissionChangeType>, doCull: boolean) => {
                            if(perms.length > 0){
                                wrapper.sendJson(asc, {userID: props.info.userID, permissions: perms}).then((a) => {
                                    if(a.type == 'Success'){
                                        if(asc.state.login.authenticatedUserName.isSome() && (asc.state.login.authenticatedUserName.value == (users.state.find((a) => a.userID == props.info.userID) || {username: ""}).username)){
                                            asc.stateAction.login.setLoggedIn(asc.state.login.authenticatedUserName.value)
                                        }
                                        modal.setOpen(false)
                                        permissions.setState((s) => mergeTable<PermissionType, 'permissionID', PermissionType>(doCull ? s.filter((a) => a.userID != props.info.userID) : s, a.success, 'permissionID'))
                                    }else{
                                        console.log(a.message)
                                    }
                                })
                            }
                        }
                        grantOrRevoke(permsToGrant, grantPermissionWrapper, false)
                        grantOrRevoke(permsToRevoke, revokePermissionWrapper, true)
                    }}>Save Changes</button>
                </div>
            </div>
        }}/>
    </div>
}

function isDeleteAction(action: EditAction<any>): action is DeletePermissionAction {
    return action['delete'] == true
}

function isAddAction(action: EditAction<any>): action is AddPermissionAction {
    return action['add'] == true
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
    add = true;
    constructor(permissionKey: number){
        super();
        this.permissionKey = permissionKey;
    }
    applyActionLocal(data) {
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