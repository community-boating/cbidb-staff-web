import { FOTVContext } from "async/providers/FOTVProvider";
import { FOTVType, RestrictionGroupType, deleteRestrictionGroup } from "async/staff/dockhouse/fotv-controller";
import { Action, getInfo, subStateWithSet } from "components/dockhouse/actionmodal/ActionModalProps"
import { ModalCloseButton, ModalContext, ModalHeader } from "components/wrapped/Modal";
import { Dispatch, ReactNode } from "react"

import * as React from 'react';
import { mergeTable } from "../../../../pages/dockhouse/fotv-controller/shared";

export type ConfirmDeleteInfo = {
    restrictionGroupID: number
    setRestrictionGroup: React.Dispatch<React.SetStateAction<RestrictionGroupType[]>>
}

function ConfirmDeleteModal(props: {info: ConfirmDeleteInfo}){
    const modal = React.useContext(ModalContext);
    return <div className='flex flex-col w-[25vw]'>
        <ModalHeader>
            Delete
        </ModalHeader>
        <div className='flex flex-row gap-2'>
            <ModalCloseButton/>
            <button className='w-fit bg-red-500 text-white font-bold py-2 px-4 rounded mr-0 ml-auto' onClick={(v) => {
                deleteRestrictionGroup.sendJson(null, {groupID: props.info.restrictionGroupID}).then((a) => {
                    if(a.type == 'Success'){
                        props.info.setRestrictionGroup((s) => s.filter((a) => a.groupID != props.info.restrictionGroupID));
                    }else{
                        console.log('failed deleting group');
                    }
                    modal.setOpen(false);
                })
            }}>Confirm Delete</button>
        </div>
    </div>
}

export default class ActionConfirmDelete extends Action<ConfirmDeleteInfo, any>{
    constructor(restrictionGroupID: number){
        super();
        this.initState = {};
        this.modeInfo = () => {
            const fotv = React.useContext(FOTVContext);
            const restrictionGroupSet = subStateWithSet(fotv.state, fotv.setState, 'restrictionGroups')[1];
            return ({
                restrictionGroupID: restrictionGroupID,
                setRestrictionGroup: restrictionGroupSet});
        }
    }
    createModalContent(info: ConfirmDeleteInfo, state: any, setState: Dispatch<any>, isDLV: boolean): ReactNode {
        return <ConfirmDeleteModal info={getInfo(info)}/>
    }

}