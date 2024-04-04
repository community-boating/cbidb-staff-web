import { FOTVContext } from "async/providers/FOTVProvider";
import { FOTVType, RestrictionConditionType, RestrictionGroupType, UserType, updateUserWrapper, createUserWrapper, deleteRestrictionGroup } from "async/staff/dockhouse/fotv-controller";
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
import { option } from "fp-ts";
import CloseIcon from "components/wrapped/Icons";
import Button from "components/wrapped/Button";

type UpdateUserType = {
    userID?: number,
    username: string,
    password: string
}

export type EditUserInfo = {
    user: UpdateUserType
    isNew: boolean
    onComplete: (user: UserType, changedUsername: boolean, changedPassword: boolean, forceLogout: boolean) => void
    //setRestrictionGroup: React.Dispatch<React.SetStateAction<RestrictionGroupType[]>>
}

function isUser(value: any): value is UserType {
    console.log(value)
    return ((value['username'] != undefined) && (value['userID'] != undefined))
}

function EditUserModal(props: {info: EditUserInfo}){
    const modal = React.useContext(ModalContext);
    const [username, setUsername] = React.useState(props.info.user.username);
    const [password, setPassword] = React.useState(props.info.user.password);
    const [changedUsername, setChangedUsername] = React.useState(false);
    const [changedPassword, setChangedPassword] = React.useState(false);
    const [forceLogout, setForceLogout] = React.useState(false);
    const updateUsername = (username) => {
        setUsername(username)
        setChangedUsername(true)
    }
    const updatePassword = (password) => {
        setPassword(password)
        setChangedPassword(true)
    }
    const [error, setError] = React.useState<option.Option<string>>(option.none);
    return <div className='flex flex-col w-[35vw]'>
        <ModalHeader>
            {props.info.isNew ? "New User" : "Edit User"}
        </ModalHeader>
        <div className='flex flex-col w-full px-5'>
            {error.isSome() ? <div className='w-full'>
                <p className="text-red-500 inline">{error.value}</p>
                <CloseIcon className='inline float-right' onClick={(e) => {
                    e.preventDefault()
                    setError(option.none)
                }}/>
            </div> : <></>}
            <label>Username</label>
            <SimpleInput controlledValue={username} updateValue={updateUsername}/>
            <label>Password</label>
            <SimpleInput type="password" controlledValue={password} updateValue={updatePassword}/>
            {!props.info.isNew ? <div className='w-full flex flex-row'>
                <label className=''>Force Logout</label>
                <input className='mr-0 ml-auto' type="checkbox" checked={forceLogout} onChange={(e) => {
                    setForceLogout(e.target.checked)
                }}/>
            </div> : <></>}
            <div className='flex flex-row gap-2 mt-2'>
                <ModalCloseButton/>
                <Button spinnerOnClick className='w-fit bg-red-500 text-white font-bold py-2 p-4 rounded mr-0 ml-auto' onClick={(e) => {
                    e.preventDefault()
                    if(props.info.isNew){
                        return createUserWrapper.sendJson(null, {username: username, password: password}).then((a) => {
                            if(a.type == 'Success'){
                                if(isUser(a.success)){
                                    props.info.onComplete(a.success, changedUsername, changedPassword, forceLogout)
                                    modal.setOpen(false)
                                }else{
                                    setError(option.some(a.success.result))
                                }
                            }else{
                                setError(option.some(a.message))
                            }
                        })
                    }else{
                        if(!changedUsername && !changedPassword && !forceLogout){
                            modal.setOpen(false)
                            return
                        }
                        const usernameToSend = changedUsername ? option.some(username) : option.none
                        const passwordToSend = changedPassword ? option.some(password) : option.none
                        updateUserWrapper.sendJson(null, {userID: props.info.user.userID,username: usernameToSend, password: passwordToSend, changedUsername: changedUsername, changedPassword: changedPassword, forceLogout: forceLogout}).then((a) => {
                            if(a.type == 'Success'){
                                if(a.success.result == "OK"){
                                    console.log(updateUsername ? username : props.info.user.username)
                                    props.info.onComplete({userID: props.info.user.userID, username: updateUsername ? username : props.info.user.username }, changedUsername, changedPassword, forceLogout)
                                    modal.setOpen(false)
                                }else{
                                    setError(option.some(a.success.result))
                                }
                            }else{
                                setError(option.some(a.message))
                            }
                        })
                    }
                }}>Submit</Button>
            </div>
        </div>
    </div>
}

export class ActionCreateUser extends Action<EditUserInfo, any>{
    constructor(){
        super()
        this.initState = {}
        this.modeInfo = () => {
            const users = React.useContext(UsersContext)
            //const restrictionGroupSet = subStateWithSet(fotv.state, fotv.setState, 'restrictionGroups')[1];
            const onComplete = (user: UserType) => {
                users.setState((s) => s.concat(user))
            }
            return ({
                user: {username: "", password: ""},
                isNew: true,
                onComplete: onComplete})
        }
    }
    createModalContent(info: EditUserInfo, state: any, setState: Dispatch<any>, isDLV: boolean): ReactNode {
        return <EditUserModal info={getInfo(info)}/>
    }

}

export class ActionEditUser extends Action<EditUserInfo, any>{
    constructor(userID: number){
        super()
        this.initState = {}
        this.modeInfo = () => {
            const asc = React.useContext(AppStateContext)
            const users = React.useContext(UsersContext)
            //const restrictionGroupSet = subStateWithSet(fotv.state, fotv.setState, 'restrictionGroups')[1];
            const user = users.state.find((a) => a.userID == userID) || {username: "", userID: -1}
            const onComplete = (a, changedUsername, changedPassword, forceLogout) => {
                if((asc.state.login.authenticatedUserName.getOrElse(undefined) == user.username) && (changedUsername || changedPassword || forceLogout))
                    asc.stateAction.login.logout()
                users.setState((s) => mergeTable<UserType, 'userID', UserType>(s, [a], 'userID'))
            }
            
            return ({
                user: {...user, password: ""},
                isNew: false,
                onComplete: onComplete})
        }
    }
    createModalContent(info: EditUserInfo, state: any, setState: Dispatch<any>, isDLV: boolean): ReactNode {
        return <EditUserModal info={getInfo(info)}/>
    }

}