import { deleteUserWrapper } from "async/staff/dockhouse/fotv-controller";
import { Action, getInfo } from "components/dockhouse/actionmodal/ActionModalProps"
import { ModalCloseButton, ModalContext, ModalHeader } from "components/wrapped/Modal";
import { Dispatch, ReactNode } from "react"

import * as React from 'react';
import { UsersContext } from "async/providers/UsersProvider";
import { AppStateContext } from "app/state/AppStateContext";

export type ConfirmDeleteUserInfo = {
    userID: number
    username: string
    onComplete: () => void
}

function ConfirmDeleteUserModal(props: {info: ConfirmDeleteUserInfo}){
    const modal = React.useContext(ModalContext)
    const asc = React.useContext(AppStateContext)
    return <div className='flex flex-col w-[25vw]'>
        <ModalHeader>
            Delete User
        </ModalHeader>
        <h1>{props.info.username + " (" + props.info.userID + ")"}</h1>
        <div className='flex flex-row gap-2'>
            <ModalCloseButton/>
            <button className='w-fit bg-red-500 text-white font-bold py-2 px-4 rounded mr-0 ml-auto' onClick={(v) => {
                deleteUserWrapper.sendJson(asc, {userID: props.info.userID}).then((a) => {
                    if(a.type == 'Success'){
                        props.info.onComplete()
                        modal.setOpen(false);
                    }else{
                        console.log('failed deleting group');
                    }
                })
            }}>Confirm Delete</button>
        </div>
    </div>
}

export default class ActionConfirmDeleteUser extends Action<ConfirmDeleteUserInfo, any>{
    constructor(userID: number){
        super();
        this.initState = {};
        this.modeInfo = () => {
            const users = React.useContext(UsersContext)
            const asc = React.useContext(AppStateContext)
            const username = (users.state.find((a) => a.userID == userID) || {username: ""}).username
            return ({
                userID: userID,
                username: username,
                onComplete: () => {
                    users.setState((s) => s.filter((a) => a.userID != userID))
                    if(asc.state.login.authenticatedUserName.getOrElse(undefined) == username)
                        asc.stateAction.login.logout()
                }})
        }
    }
    createModalContent(info: ConfirmDeleteUserInfo, state: any, setState: Dispatch<any>, isDLV: boolean): ReactNode {
        return <ConfirmDeleteUserModal info={getInfo(info)}/>
    }

}