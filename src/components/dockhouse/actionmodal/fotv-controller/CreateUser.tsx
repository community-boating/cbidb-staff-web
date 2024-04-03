import { FOTVContext } from "async/providers/FOTVProvider";
import { FOTVType, RestrictionConditionType, RestrictionGroupType, UserType, changePasswordWrapper, createUserWrapper, deleteRestrictionGroup } from "async/staff/dockhouse/fotv-controller";
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

type CreateUserType = {
    username: string,
    password: string
}

export type CreateUserInfo = {
    user: CreateUserType
    onComplete: () => void
    //setRestrictionGroup: React.Dispatch<React.SetStateAction<RestrictionGroupType[]>>
}

function CreateUserModal(props: {info: CreateUserInfo}){
    const modal = React.useContext(ModalContext);
    const [username, setUsername] = React.useState(props.info.user.username);
    const [password, setPassword] = React.useState(props.info.user.password);
    return <div className='flex flex-col w-[25vw]'>
        <ModalHeader>
            Edit User
        </ModalHeader>
        <div className='flex flex-col'>
            <label>Username</label>
            <SimpleInput controlledValue={username} updateValue={setUsername}/>
            <label>Password</label>
            <SimpleInput type="password" controlledValue={password} updateValue={setPassword}/>
            <div className='flex flex-row'>
            <button className='w-fit bg-grey-500 font-bold py-2 px-4 border-gray-700 border-solid border rounded'>Cancel</button>
            <button className='w-fit bg-red-500 text-white font-bold py-2 px-4 rounded mr-0 ml-auto' onClick={(v) => {
                createUserWrapper.sendJson(null, {username: username, password: password}).then((a) => {
                    if(a.type == 'Success'){
                        props.info.onComplete()
                    }else{
                        console.log('failed deleting group');
                    }
                    modal.setOpen(false);
                })
            }}>Confirm Delete</button>
        </div>
        </div>
    </div>
}

export default class ActionCreateUser extends Action<CreateUserInfo, any>{
    constructor(){
        super();
        this.initState = {};
        this.modeInfo = () => {
            const users = React.useContext(UsersContext);
            //const restrictionGroupSet = subStateWithSet(fotv.state, fotv.setState, 'restrictionGroups')[1];
            return ({
                user: {username: "", password: ""},
                onComplete: () => alert("TODO")});
        }
    }
    createModalContent(info: CreateUserInfo, state: any, setState: Dispatch<any>, isDLV: boolean): ReactNode {
        return <CreateUserModal info={getInfo(info)}/>
    }

}