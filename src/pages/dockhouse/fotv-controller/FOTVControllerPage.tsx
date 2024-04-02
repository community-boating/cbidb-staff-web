import { Tab } from '@headlessui/react';
import FOTVProvider, { FOTVContext } from 'async/providers/FOTVProvider';
import { deleteLogoImage, deleteRestriction, FOTVType, ImageType, LogoImageType, putLogoImage, putRestriction, putRestrictionGroup, putSingletonData, RestrictionGroupType, RestrictionType, restrictionValidator, SingletonDataType, uploadLogoImage as uploadImage } from 'async/staff/dockhouse/fotv-controller';
import { ActionModalContext } from 'components/dockhouse/actionmodal/ActionModal';
import { NoneAction, subStateWithSet } from 'components/dockhouse/actionmodal/ActionModalProps';
import EditRestrictionModal, { setRestrictionPartial } from 'components/dockhouse/actionmodal/fotv-controller/EditRestrictionModal';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import APIWrapper, { makePostJSON } from 'core/APIWrapper';
import { ProviderState, tempParams } from 'core/AsyncStateProvider';
import * as React from 'react';
import { Edit, Plus, X } from 'react-feather';
import ActionConfirmDelete from './ActionConfirmDelete';
import { ProviderWithSetState } from 'async/providers/ProviderType';
import { AppStateContext } from 'app/state/AppStateContext';
import * as t from 'io-ts';
import { ApiResult, Failure, Success } from 'core/APIWrapperTypes';
import { imageVersionByID, getImageSRC, mergeTable, findFileExtension } from './shared';
import { BufferedInput } from 'components/wrapped/Input';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { option } from 'fp-ts';
import CloseIcon from 'components/wrapped/Icons';
import { FlagColor } from 'async/staff/dockhouse/flag-color';
import * as moment from "moment";
import { DHGlobalContext } from 'async/providers/DHGlobalProvider';
import { getLatestFlag } from 'components/dockhouse/Header';

function TabTitle(props: {children: React.ReactNode, active: boolean}){
    return <h2>
        {props.children}
    </h2>
}

function getActiveProgramID(fotvData: FOTVType){
    return parseInt((fotvData.singletonData.find((a) => a.data_key == "ACTIVE_PROGRAM_ID") || {value: "0"}).value)
}

function ProgramSwitcher(props: {className: string}){
    const fotv = React.useContext(FOTVContext);
    const singletonData = subStateWithSet(fotv.state, fotv.setState, 'singletonData');
    const programID = getActiveProgramID(fotv.state);
    return <h1 className={props.className} onClick={(e) => {
        e.preventDefault();
        putSingletonData.sendWithParams(null, tempParams)(makePostJSON([{data_key: "ACTIVE_PROGRAM_ID", value: programID == MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM ? MAGIC_NUMBERS.PROGRAM_TYPE_ID.JUNIOR_PROGRAM.toString() : MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM.toString()}])).then((a) => {
            if(a.type == "Success"){
                singletonData[1]((s) => mergeTable<SingletonDataType, 'data_key', SingletonDataType>(s, a.success, 'data_key'))
            }else{
                alert("Server error");
            }
        })
    }}>{programID == MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM ? "Set JP" : "Set AP"}</h1>
}

export default function FOTVControllerPage(props) {
    const [editing, setEditing] = React.useState(false);
    return <DraggingProvider>
                <Tab.Group className="grow-[1]">
                    <CardLayout direction={LayoutDirection.VERTICAL}>
                        <Card weight={FlexSize.S_1} title={<Tab.List>
                            <Tab className="p-2">Restrictions</Tab>
                            <Tab className="p-2">Images</Tab>
                            <ProgramSwitcher className="p2 inline cursor-pointer"/>
                        </Tab.List>}>
                            <Tab.Panels className="grow-[1]">
                                <Tab.Panel className="h-full"><RestrictionsPanel editing={editing} setEditing={setEditing} /></Tab.Panel>
                                <Tab.Panel className="h-full flex flex-col"><ImagePanel/></Tab.Panel>
                            </Tab.Panels>
                        </Card>
                    </CardLayout>
                </Tab.Group>
            </DraggingProvider>;
};

const RESTRICTION_CONDITION_TYPES = {
    ACTIONS: {
        ENABLE: 0,
        DISABLE: 1,
        TOGGLE: 2
    },
    TYPES: {
        TIME: 0,
        STATE: 1
    },
    INFOS: {
        OPEN: 'OPEN',
        CLOSE: 'CLOSE',
        GREEN: 'GREEN',
        YELLOW: 'YELLOW',
        RED: 'RED',
        AP: 'AP',
        JP: 'JP'
    }
}

const INFO_FLAG_MAP = {
    [RESTRICTION_CONDITION_TYPES.INFOS.CLOSE]: FlagColor.BLACK,
    [RESTRICTION_CONDITION_TYPES.INFOS.GREEN]: FlagColor.GREEN,
    [RESTRICTION_CONDITION_TYPES.INFOS.YELLOW]: FlagColor.YELLOW,
    [RESTRICTION_CONDITION_TYPES.INFOS.RED]: FlagColor.RED
}

function processCondition(currentRestrictionStates: {[key: number]: boolean}, restrictionID: number, restrictionConditionAction: number){
    if(restrictionConditionAction == RESTRICTION_CONDITION_TYPES.ACTIONS.ENABLE)
        currentRestrictionStates[restrictionID] = true
    else if(restrictionConditionAction == RESTRICTION_CONDITION_TYPES.ACTIONS.DISABLE)
        currentRestrictionStates[restrictionID] = false
    else if(restrictionConditionAction == RESTRICTION_CONDITION_TYPES.ACTIONS.TOGGLE)
        currentRestrictionStates[restrictionID] = !currentRestrictionStates[restrictionID]
}

function calculateRestrictionConditions(fotvData: FOTVType, currentFlag: FlagColor){
    const currentRestrictionStates: {[key: number]: boolean} = {}
    fotvData.restrictions.forEach((a, i) => {
        currentRestrictionStates[a.restrictionID] = false
    })
    const currentProgramID = getActiveProgramID(fotvData);
    fotvData.restrictionConditions.forEach((a) => {
        if(a.conditionType.getOrElse(-1) == RESTRICTION_CONDITION_TYPES.TYPES.STATE){
            const conditionInfo = a.conditionInfo.getOrElse("");
            if(conditionInfo == RESTRICTION_CONDITION_TYPES.INFOS.AP && currentProgramID == MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM)
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
            else if(conditionInfo == RESTRICTION_CONDITION_TYPES.INFOS.JP && currentProgramID == MAGIC_NUMBERS.PROGRAM_TYPE_ID.JUNIOR_PROGRAM)
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
            else if(conditionInfo == RESTRICTION_CONDITION_TYPES.INFOS.OPEN && currentFlag != FlagColor.BLACK)
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
            else if(currentFlag == INFO_FLAG_MAP[conditionInfo])
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
        }else if(a.conditionType.getOrElse(-1) == RESTRICTION_CONDITION_TYPES.TYPES.TIME){
            const time = moment(a.conditionInfo.getOrElse(""));
            if(moment().isAfter(time))
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
        }
    })
    return currentRestrictionStates;
}

const NewAction = 'New';

const MoveAction = 'Move';

function mapRestrictionData(fotv: ProviderWithSetState<FOTVType>, editRestriction: (id: number) => void, currentFlag: FlagColor, editing?: boolean){
    const restrictionConditionActivations = calculateRestrictionConditions(fotv.state, currentFlag)
    return {
        items: fotv.state.restrictions.map((a) => ({
            title: a.title,
            itemID: a.restrictionID,
            groupID: a.groupID,
            displayOrder: a.displayOrder,
            display: <Restriction restriction={a} setRestrictions={subStateWithSet(fotv.state, fotv.setState, 'restrictions')[1]} editing={editing} editRestriction={editRestriction} restrictionConditionActivations={restrictionConditionActivations}/>
            })),
        groups: fotv.state.restrictionGroups
        }
}

function RestrictionsPanel(props: {editing: boolean, setEditing: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [editRestrictionID, setEditRestrictionID] = React.useState<number>(null)
    const fotv = React.useContext(FOTVContext)
    const restrictions = subStateWithSet(fotv.state, fotv.setState, 'restrictions')
    const restrictionGroups = subStateWithSet(fotv.state, fotv.setState, 'restrictionGroups')
    const flagColor = getLatestFlag(React.useContext(DHGlobalContext))
    const after = (a: ApiResult<RestrictionType[]>) => {
        if(a.type == 'Success')
            restrictions[1]((s) => mergeTable<RestrictionType, 'restrictionID', RestrictionType>(s, a.success, 'restrictionID'))
        else
            console.log('error setting restrictions');
    }
    const restrictionItems = React.useMemo(() => (restrictions[0] || []).map(mapRestrictionToDraggable), [restrictions[0]]);
    if(fotv.state.restrictions == undefined)
        return <p>idiot</p>;
    const updateGroupName = (name: string, groupID: number) => {
        putRestrictionGroup.sendWithParams(null, tempParams)(makePostJSON([{title: option.some(name), groupID: groupID}])).then((a) => {
            if(a.type == "Success"){
                restrictionGroups[1]((s) => mergeTable<RestrictionGroupType, 'groupID', RestrictionGroupType>(s, a.success, 'groupID'))
            }else{
                alert("Server error");
            }
        })
    }
    return <div className="flex flex-col h-full gap-4">
        <EditRestrictionModal openRestrictionID={editRestrictionID} setOpen={() => {setEditRestrictionID(null)}}/>
        <div className='flex grow-[1] basis-0 w-full overflow-hidden'>
                {((fotv.providerState == ProviderState.SUCCESS) ? <DraggableGrid gridData={mapRestrictionData(fotv, setEditRestrictionID, flagColor, props.editing)} editing={props.editing} addGroup={() => {
                    putRestrictionGroup.sendWithParams(null, tempParams)(makePostJSON([{title: 'NEW'}])).then((a) => {
                        if(a.type === 'Success'){
                            fotv.setState((s) => ({...s, restrictionGroups: s.restrictionGroups.concat(a.success)}))
                        }else{
                            alert('Server error');
                        }
                    });
                }
                } handleDrop={(drag, setDrag, groupID, displayOrder, currentItemID) => (e) => {
                    handleRestrictionsDrop(restrictionItems, after)(drag, setDrag, groupID, displayOrder, currentItemID)(e);
                }}
                updateGroupName={updateGroupName}
                /> : <>Loading...</>)}
        </div>
        <div className='flex flex-row gap-4 text-2xl'>
            <button className={'w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded' + (props.editing ? ' bg-blue-700' : '')} onClick={(e) => {
                e.preventDefault();
                props.setEditing((e) => !e);
            }}>Toggle Edit Mode</button>
            {props.editing ? <DraggingContext.Consumer>{(drag) => <>
            <div className='rounded border-2 border-green-500 pr-2 cursor-move' draggable onDragStart={(e) => {
                    drag.setDrag({dragging: true, type: NewAction, itemID: undefined, groupID: undefined});
            }}><Plus className='inline text-green-500'/><p className='inline align-middle'>New Restriction</p>
            </div>
            <div className='rounded border-2 border-red-500 pr-2' onDragOver={(e) => {
                if(drag.drag.type == MoveAction){
                    e.preventDefault();
                }}} onDrop={(e) => {
                    const restrictionToDelete = fotv.state.restrictions.find((a) => a.restrictionID == drag.drag.itemID);
                    if(restrictionToDelete != undefined){
                        const items = getItemsToChangeDisplayOrder(restrictionItems,restrictionToDelete.displayOrder,restrictionToDelete.groupID,false,undefined);
                        if(items.length > 0)
                            putRestriction.sendWithParams(null, tempParams)(makePostJSON(items.map(mapDraggableToRestriction))).then();
                    }
                    const extra = getItemsToChangeDisplayOrder(restrictionItems, restrictionToDelete.displayOrder, restrictionToDelete.groupID, false,undefined);
                    deleteRestriction.sendWithParams(null, tempParams)(makePostJSON({restrictionID: drag.drag.itemID})).then((a) => {
                        if(a.type == 'Success'){
                            fotv.setState((s) => ({...s, restrictions: s.restrictions.filter((a) => a.restrictionID != drag.drag.itemID)}));
                        }else{
                            alert('Server error');
                        }
                    })
                    if(extra.length > 0)
                    putRestriction.sendWithParams(null, tempParams)(makePostJSON(extra.map(mapDraggableToRestriction))).then((a) => {
                        if(a.type == 'Success'){
                            restrictions[1]((s) => mergeTable<any, any, any>(s, a.success, 'restrictionID'));
                        }else{
                            console.log('error setting');
                        }
                })
            }}>
                <CloseIcon/>
                <p className='inline align-middle'>Delete Restriction</p>
            </div>
        </>}</DraggingContext.Consumer> : <></>}
        </div>
    </div>
}

type DraggableGridItem = {title: string, itemID: number, groupID: number, displayOrder: number, display?: React.ReactNode}

type DraggableGridGroup = {title: string, groupID: number}

type DraggableGridData = {items: DraggableGridItem[], groups: DraggableGridGroup[]}

function DraggableGrid(props: { gridData: DraggableGridData, editing: boolean, addGroup: () => void, handleDrop: HandleDropType, updateGroupName: (name: string, groupID: number) => void }) {
    return <div className='grid grid-cols-4 gap-4 w-full max-w-full overflow-scroll custom-scrollbar hidden-x-scrollbar auto-rows-[calc(50%-1rem)]'>
        {props.gridData.groups.map((g) => <DraggableGroup editing={props.editing} group={g} items={props.gridData.items} handleDrop={props.handleDrop} key={g.groupID} updateGroupName={props.updateGroupName}/>)}
        {props.editing ? <><div className='col grow-[1] basis-0 max-w-full'>
            <button className=' grow-[1]' onClick={(e) => {
                    e.preventDefault();
                    props.addGroup();
                }}><Plus className='grow-[1] max-w-full border-none' width='100%' height='auto'/>
            </button>
        </div>
        </> : <></>}
    </div>
}

function mapImageItem(fotv: ProviderWithSetState<FOTVType>, drag, editing?: boolean) {
    const versionByID = imageVersionByID(fotv);
    return fotv.state.logoImages.map((a) => ({
        title: a.title,
        itemID: a.logoImageID,
        groupID: a.imageType,
        displayOrder: a.displayOrder,
        display: <div className='block overflow-hidden h-full min-h-full relative w-full' draggable onDragStart={(e) => {
            drag.setDrag({dragging: true, type: MoveAction, itemID: a.logoImageID});
        }} onDragEnd={(e) => {
            e.preventDefault();
            drag.setDrag(defaultDragging.drag);
        }}>
            <img draggable={false} src={getImageSRC(a.imageID, versionByID)} className='block absolute h-full mx-auto w-full object-contain'/></div>
    }))
}

function getItemsToChangeDisplayOrder(items: DraggableGridItem[], displayOrder: number, groupID: number, increase: boolean, stopOverrideOrder: number): Partial<DraggableGridItem>[] {
    var itemsToCheck = items.filter((a) => a.groupID == groupID).sort((a, b) => a.displayOrder - b.displayOrder);
    var itemsToChange = [];
    if(!increase){
        console.log(itemsToCheck);
        console.log(increase);
    }
    const displayOrderIndex = itemsToCheck.findIndex((a) => a.displayOrder == displayOrder);
    if(displayOrderIndex == -1)
        return [];
    var lastDisplayOrder = displayOrder;
    if(increase)
        itemsToChange.push({itemID: itemsToCheck[displayOrderIndex].itemID, displayOrder: displayOrder + 1});
    for (var i = displayOrderIndex + (increase ? 1 : 1); i < itemsToCheck.length && i >= 0; i=i+1){
        const currentCheck = itemsToCheck[i];
        const displayOrderDirectlyAfter = lastDisplayOrder + (increase ? 1 : 1);
        if(!increase){
            console.log(currentCheck.displayOrder);
            console.log(displayOrderDirectlyAfter);
        }
        if(i == stopOverrideOrder){
            break;
        }
        if(displayOrderDirectlyAfter == currentCheck.displayOrder){
            //console.log('happen');
            lastDisplayOrder = currentCheck.displayOrder;
            itemsToChange.push({itemID: currentCheck.itemID, displayOrder: Math.max(Math.min(currentCheck.displayOrder + (increase ? 1 : -1),6),0)})
        }else{
            break;
        }
    }
    if(itemsToChange.length > 0){
        console.log("CHANGING");
        console.log(itemsToChange);
        console.log(displayOrder);
        console.log(groupID);
    }
    return itemsToChange;
}

function ImagePanel() {
    const fotv = React.useContext(FOTVContext);
    const asc = React.useContext(AppStateContext);
    const drag = React.useContext(DraggingContext);
    const mappedItems = mapImageItem(fotv, drag).sort((a, b) => a.displayOrder - b.displayOrder);
    const logoImageSet = subStateWithSet(fotv.state, fotv.setState, 'logoImages');
    //const updateLogoImages = (items: Partial<LogoImageType>[]) => {
        
    //}
    const updateLogoImagesLocal = (a) => {
        console.log('trying');
        console.log(a);
        if(a.type == 'Success'){
            logoImageSet[1]((s) => mergeTable<LogoImageType, 'logoImageID', LogoImageType>(s, a.success, 'logoImageID'))
        }else{
            console.log('error updating image');
        }
    }
    const images = subStateWithSet(fotv.state, fotv.setState, 'logoImages');
    const handleDrop = handleDropGeneric(mappedItems, (items) => {
        putLogoImage.sendWithParams(asc, tempParams)(makePostJSON(items.map((a) => ({...a, logoImageID: a.itemID, itemID: undefined, imageType: a.groupID, groupID: undefined})))).then(updateLogoImagesLocal)
    }, (e, displayOrder, groupID, extraItemsToChange) => {
        if(e.dataTransfer.files.length == 0)
            return;
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', e.dataTransfer.files[0]);
        const suffix = findFileExtension(e.dataTransfer.files[0].name);
        const current = fotv.state.logoImages.find((a) => a.displayOrder == displayOrder && a.imageType == groupID);
        uploadImage(current == undefined ? null : current.imageID,suffix).sendRaw(tempParams, formData).then((b) => {
            if(b.status == 200){
                if(current == undefined){
                    console.log('making new');
                    //alert('making new');
                    putLogoImage.sendWithParams(asc, tempParams)(makePostJSON([{title: 'NEW', displayOrder: displayOrder, imageType: groupID, imageID: b.data.imageID}])).then(updateLogoImagesLocal)
                }
                images[1]((im) => mergeTable<LogoImageType, 'imageID', LogoImageType>(im, [b.data], 'imageID'));
            }else{
                //console.log(b);
            }
        })
        //const params = current == undefined ? {title: 'NEW', displayOrder: displayOrder, imageType: groupID} : {imageID: current.logoImageID, imageVersion: current.imageVersion + 1};
        //putLogoImage.sendWithParams(asc, tempParams)(makePostJSON([params])).then((a) => {
        //    if(a.type == 'Success'){
                
        //    }
        //}).then(updateImagesLocal);
    })
    const itemsBig = mappedItems.filter((a) => a.groupID == 0);
    const itemsSmall = mappedItems.filter((a) => a.groupID == -1);
    const bigCols = Math.min(8, itemsBig.length + 1);
    const smallCols = Math.min(8, itemsSmall.length + 1);
    const updateGroupName = (name: string, groupID: number) => {};
    const customGroupBucket = (onDrop: (e) => void) => {
        return <input type="file" onChange={(e) => {
            e.preventDefault();
            const e2: any = {
                dataTransfer: {
                    files: e.target.files
                },
                preventDefault: () => {

                }
            }
            onDrop(e2)
        }}/>
    }
    return <div className='flex grow-[2] flex-col space-y-4 flex-grow overflow-scroll'>
        <div className='flex grow-[1] w-[600px] mx-auto basis-0 space-x-4'>
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "AP Sliding Image",
                    groupID: -3
                }
            }
            items={mappedItems.filter((a) => a.groupID == -3)}
            handleDrop={handleDrop}
            updateGroupName={updateGroupName}
            extraGroupBucket={customGroupBucket}
            />
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "JP Sliding Image",
                    groupID: -4
                }
            }
            items={mappedItems.filter((a) => a.groupID == -4)}
            handleDrop={handleDrop}
            updateGroupName={updateGroupName}
            extraGroupBucket={customGroupBucket}
            />
        </div>
        <div className='flex grow-[1] w-[300px] mx-auto basis-0 space-x-4'>
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "Main Logo Image",
                    groupID: -2
                }
            }
            items={mappedItems.filter((a) => a.groupID == -2)}
            handleDrop={handleDrop}
            updateGroupName={updateGroupName}
            extraGroupBucket={customGroupBucket}
            />
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "Background Image",
                    groupID: -5
                }
            }
            items={mappedItems.filter((a) => a.groupID == -5)}
            handleDrop={handleDrop}
            updateGroupName={updateGroupName}
            extraGroupBucket={customGroupBucket}
            />
        </div>
        <div className='flex grow-[1] basis-0 space-x-4'>
            <DraggableGroup cols={bigCols} rows={1} hideX={true} editing={true} group={
                {
                    title: "Big Images",
                    groupID: 0
                }
            }
            items={itemsBig}
            handleDrop={handleDrop}
            updateGroupName={updateGroupName}
            extraGroupBucket={customGroupBucket}
            />
        </div>
        <div className='flex grow-[1] basis-0'>
            <DraggableGroup cols={smallCols} rows={1} hideX={true} editing={true} group={
                {
                    title: "Small Images",
                    groupID: -1
                }
            }
            items={itemsSmall}
            handleDrop={handleDrop}
            updateGroupName={updateGroupName}
            extraGroupBucket={customGroupBucket}
            />
        </div>
        <div className='rounded border-2 border-red-500 pr-2 space-x-4' onDragOver={(e) => {
                if(drag.drag.type == MoveAction){
                    e.preventDefault();
                }}} onDrop={(e) => {
                    deleteLogoImage.sendWithParams(null, tempParams)(makePostJSON({logoImageID: drag.drag.itemID})).then((a) => {
                        if(a.type == 'Success'){
                            fotv.setState((s) => ({...s, logoImages: s.logoImages.filter((a) => a.logoImageID != drag.drag.itemID)}));
                        }else{
                            alert('Server error');
                        }
                    })
                    const draggedImage = fotv.state.logoImages.find((a) => a.logoImageID == drag.drag.itemID);
                    const toSend = getItemsToChangeDisplayOrder(mappedItems, draggedImage.displayOrder, draggedImage.imageType, false, draggedImage.imageID);
                    if(toSend.length > 0){
                        putLogoImage.sendWithParams(null, tempParams)(makePostJSON(toSend.map((a) => ({...a, logoImageID: a.itemID, itemID: undefined})))).then((a) => {
                            if(a.type == 'Success')
                                logoImageSet[1]((b) => mergeTable<LogoImageType, 'imageID', LogoImageType>(b, a.success, 'imageID'));
                            else
                                console.log('Server error');
                        })
                    }
            }}>
                <CloseIcon className='inline text-red-500'/>
                <p className='inline align-middle'>Delete Image</p>
            </div>
    </div>
}

type DragInfo = {dragging: boolean, type: string, itemID: number, groupID: number}

const defaultDragging: {drag: DragInfo, setDrag: React.Dispatch<React.SetStateAction<DragInfo>>} = {drag: {dragging: false, type: undefined, itemID: undefined, groupID: undefined}, setDrag: () => {}};

const DraggingContext = React.createContext(defaultDragging);

function DraggingProvider(props: {children: React.ReactNode}){
    const [info, setInfo] = React.useState(defaultDragging.drag);
    return <DraggingContext.Provider value={{drag: info,setDrag: setInfo}}>
        {props.children}
    </DraggingContext.Provider>
}

type HandleDropType = (drag: DragInfo, setDrag: React.Dispatch<React.SetStateAction<DragInfo>>, groupID: number, displayOrder: number, currentItemID: number) => React.DragEventHandler<any>;

const mapDraggableToRestriction: (a: DraggableGridItem) => Partial<RestrictionType> = (a) => ({...a, restrictionID: a.itemID, itemID: undefined});

const mapRestrictionToDraggable: (a: Partial<RestrictionType> & {groupID: number, title: string, displayOrder: number} ) => DraggableGridItem = (a) => ({...a, itemID: a.restrictionID});

const handleRestrictionsDrop: (items: DraggableGridItem[], after: (s: ApiResult<RestrictionType[]>) => void) => HandleDropType = (items, after) => {
    return handleDropGeneric(items, (items) => {
        putRestriction.sendWithParams(undefined, tempParams)(makePostJSON(items.map(mapDraggableToRestriction))).then(after);
    }, (e, displayOrder, groupID, extraItemsToChange) => {
        putRestriction.sendWithParams(undefined, tempParams)(makePostJSON(extraItemsToChange.map(mapDraggableToRestriction).concat([{displayOrder: displayOrder, groupID: groupID, title: 'New', message: 'New', imageID: null}]))).then(after)
    })
}

const handleDropGeneric: (currentItems: DraggableGridItem[], updateItems: (i: Partial<DraggableGridItem>[]) => void, handleCreate: (e: React.DragEvent<HTMLDivElement>, displayOrder: number, groupID: number, extraItemsToChange: Partial<DraggableGridItem>[]) => void) => HandleDropType = (currentItems, updateItems, handleCreate) => (drag, setDrag, groupID, displayOrder, currentItemID) => (e: React.DragEvent<HTMLDivElement>) => {
    const type = drag.type;
    if(type == MoveAction){
        var toSend = [];
        const itemID = drag.itemID;
        //if(currentItemID != undefined){
            const sameGroup = drag.groupID == groupID;
            const draggedItem = currentItems.find((a) => a.itemID == itemID);
            if(draggedItem != undefined){
                //toSend = toSend.concat(getItemsToChangeDisplayOrder(currentItems, draggedItem.displayOrder, draggedItem.groupID, false, sameGroup ? displayOrder : undefined))
            }
            if(currentItemID != undefined){
                toSend = toSend.concat(getItemsToChangeDisplayOrder(currentItems, displayOrder, groupID, true, sameGroup ? draggedItem.displayOrder : undefined))
            }
        //}
        toSend.push({itemID: itemID, groupID: groupID, displayOrder: displayOrder})
        updateItems(toSend);
    }else{
        handleCreate(e, displayOrder, groupID, getItemsToChangeDisplayOrder(currentItems, displayOrder, groupID, true, undefined));
    }
    setDrag(defaultDragging.drag);
}

//onDragOver={(e) => {e.preventDefault()}} onDrop={handleDrop(props.group.groupID)}

function isSlotAcceptableForDrag (e: React.DragEvent<HTMLDivElement>, drag: DragInfo, displayOrder: number, currentItemID: number, groupID: number, maxDisplayOrderForGroup: number){
    console.log(currentItemID);
    console.log(drag.itemID);
    return !drag.dragging ||((currentItemID == undefined || (drag.itemID != currentItemID)) && (displayOrder < maxDisplayOrderForGroup || drag.groupID == groupID));
}

function DraggableGroupBucket(props: {handleDrop:HandleDropType, currentItemID: number, children: React.ReactNode, editing?: boolean, groupID: number, displayOrder: number, maxDisplayOrderForGroup: number}) {
    return <DraggingContext.Consumer>{(drag) => <div className={' flex flex-col'} onDragOver={(e) => {
        isSlotAcceptableForDrag(e, drag.drag,props.displayOrder,props.currentItemID,props.groupID,props.maxDisplayOrderForGroup) && e.preventDefault();
        }} onDrop={(e) => {props.handleDrop(drag.drag, drag.setDrag, props.groupID, props.displayOrder, props.currentItemID)(e);}}>
        {props.children}
    </div>}</DraggingContext.Consumer>;
}

function getMaxDisplayOrderForGroup (items: DraggableGridItem[], groupID: number, maxDisplayOrder: number){
    const itemsSorted = items.filter((a) => a.groupID == groupID).sort((a, b) => b.displayOrder - a.displayOrder);
    if(itemsSorted.length == 0 || itemsSorted[0].displayOrder != maxDisplayOrder)
        return maxDisplayOrder + 1;
    var lastDisplayOrder = maxDisplayOrder;
    for(var i = 1; i < itemsSorted.length; i++){
        const a = itemsSorted[i];
        if(a.displayOrder == lastDisplayOrder - 1)
            lastDisplayOrder = a.displayOrder;
        else
            break;
    }
    return lastDisplayOrder;
}

function DraggableGroup(props: {editing: boolean, group: DraggableGridGroup, items: DraggableGridItem[], handleDrop: HandleDropType, cols?: number, rows?: number, hideX?: boolean, updateGroupName: (name: string, groupID: number) => void, extraGroupBucket?: (onDrop: (e) => void) => React.ReactNode}){
    const mc = React.useContext(ActionModalContext);
    const groupItems = props.items.filter((r) => r.groupID == props.group.groupID);
    const byDisplayOrder: {[key: number]: DraggableGridItem} = {};
    groupItems.forEach((a) => {
        byDisplayOrder[a.displayOrder] = a;
    })
    var allGroupBuckets = [];
    const cols = props.cols ? props.cols : 1;
    const rows = props.rows ? props.rows : 6;
    const maxDisplayOrder = cols*rows - 1;
    for(var i = 0; i <= maxDisplayOrder; i++){
        allGroupBuckets.push(i);
    }
    const drag = React.useContext(DraggingContext);
    //yikes
    const handleDropWrapped = (i) => props.handleDrop({dragging: true, type: NewAction, groupID: props.group.groupID, itemID: byDisplayOrder[i] ? byDisplayOrder[i].itemID : undefined}, () => {}, props.group.groupID, i, byDisplayOrder[i] ? byDisplayOrder[i].itemID : undefined)
    return <div className='flex flex-col grow-[1] bg-background rounded-sm'>
                <div className='flex flex-row w-full'>
                    <h1 className='p-2 flex'>
                        {props.editing ?<BufferedInput className="w-full bg-transparent rounded-sm border-solid border-2 outline-none" value={props.group.title} onValueChanged={(v) => {
                            props.updateGroupName(v, props.group.groupID);
                        }}/>
                        : <>{props.group.title}</>}
                    </h1>
                    {
                    (props.editing && !props.hideX) ? 
                    <CloseIcon className='flex ml-auto align-middle inline mr-0' height="100%" onClick={(e) => {
                        e.preventDefault();
                        mc.pushAction(new ActionConfirmDelete(props.group.groupID));
                    }}>
                        
                    </CloseIcon>
                     : <></>}
                </div>
            <div className={'flex grow-[1] grid gap-4'} style={{
                gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))',
                gridTemplateRows: 'repeat(' + rows + ', minmax(0, 1fr))'
        }}>
            {allGroupBuckets.map((i) => <>
                
                <DraggableGroupBucket currentItemID={byDisplayOrder[i] !== undefined ? byDisplayOrder[i].itemID : undefined} handleDrop={props.handleDrop} groupID={props.group.groupID} displayOrder={i} editing={props.editing} maxDisplayOrderForGroup={getMaxDisplayOrderForGroup(props.items, props.group.groupID, maxDisplayOrder)} key={'i' + i + 'item' + (byDisplayOrder[i] || {itemID: 0}).itemID}>
                    {props.extraGroupBucket ? props.extraGroupBucket(handleDropWrapped(i)) : <></>}
                    <div className={'border-2 grow-[1] ' + (drag.drag.dragging ? ' border-red-200' : '') + (props.editing ? ' rounded-md' : ' border-transparent')}>
                        {(byDisplayOrder[i] !== undefined) ? byDisplayOrder[i].display : <></>}
                    </div>
                </DraggableGroupBucket>
                </>)}
        </div>
    </div>
}

function RestrictionInternal(props: {title: React.ReactNode}){
    return <div className="b-black">{props.title}</div>
}

function Restriction(props: {restriction: FOTVType['restrictions'][number], editing: boolean, setRestrictions: React.Dispatch<React.SetStateAction<FOTVType['restrictions']>>, editRestriction: (restrictionID: number) => void, restrictionConditionActivations: {[key: number] : boolean}}){
    const fotv = React.useContext(FOTVContext);
    return <DraggingContext.Consumer>{(drag) => <div className={'rounded-sm border-2 w-full h-full' + (props.editing ? ' cursor-move' : ' cursor-pointer') + (props.restrictionConditionActivations[props.restriction.restrictionID] ? ' border-orange-400' : (props.restriction.active ? ' border-red-400' : ''))} style={{color: props.restriction.textColor, backgroundColor: props.restriction.backgroundColor, fontWeight: props.restriction.fontWeight}} draggable={props.editing} onDragStart={(e) => {
        e.dataTransfer.setData('type', MoveAction);
        e.dataTransfer.setData('itemID', String(props.restriction.restrictionID));
        drag.setDrag({dragging: true, type: MoveAction, itemID: props.restriction.restrictionID, groupID: props.restriction.groupID});
    }} onDragEnd={(e) => {
        e.preventDefault();
        drag.setDrag(defaultDragging.drag);
    }} onClick={(e) => {
        e.preventDefault();
        if(!props.editing){
            setRestrictionPartial(fotv.setState, {restrictionID: props.restriction.restrictionID, active: (!props.restriction.active)})
        }
    }}>
        <RestrictionInternal title={<div className='flex flex-row align-center'>{props.restriction.title}{props.editing ? <Edit height="2em" className="ml-auto mr-0" style={{ cursor: "pointer", color: 'black' }} onClick={(e) => {
            e.preventDefault();
            props.editRestriction(props.restriction.restrictionID);
        }}/>: <></>}</div>}/>
    </div>}</DraggingContext.Consumer>
}