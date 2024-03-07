import { Tab } from '@headlessui/react';
import FOTVProvider, { FOTVContext } from 'async/providers/FOTVProvider';
import { deleteLogoImage, deleteRestriction, FOTVType, ImageType, LogoImageType, putLogoImage, putRestriction, putRestrictionGroup, RestrictionType, restrictionValidator, uploadLogoImage as uploadImage } from 'async/staff/dockhouse/fotv-controller';
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

function TabTitle(props: {children: React.ReactNode, active: boolean}){
    return <h2>
        {props.children}
    </h2>
}

export default function FOTVControllerPage(props) {
    const [editing, setEditing] = React.useState(false);
    return <DraggingProvider>
                <Tab.Group className="grow-[1]">
                    <CardLayout direction={LayoutDirection.VERTICAL}>
                        <Card weight={FlexSize.S_1} title={<Tab.List>
                            <Tab>Restrictions</Tab>
                            <Tab>Images</Tab>
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

const NewAction = 'New';

const MoveAction = 'Move';

function mapRestrictionData(fotv: ProviderWithSetState<FOTVType>, editRestriction: (id: number) => void, editing?: boolean){
    return {
        items: fotv.state.restrictions.map((a) => ({
            title: a.title,
            itemID: a.restrictionID,
            groupID: a.groupID,
            displayOrder: a.displayOrder,
            display: <Restriction restriction={a} setRestrictions={subStateWithSet(fotv.state, fotv.setState, 'restrictions')[1]} editing={editing} editRestriction={editRestriction}/>
            })),
        groups: fotv.state.restrictionGroups
        }
}

function RestrictionsPanel(props: {editing: boolean, setEditing: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [editRestrictionID, setEditRestrictionID] = React.useState<number>(null);
    const fotv = React.useContext(FOTVContext);
    const restrictions = subStateWithSet(fotv.state, fotv.setState, 'restrictions');
    const after = (a: ApiResult<RestrictionType[]>) => {
        if(a.type == 'Success')
            restrictions[1]((s) => mergeTable<RestrictionType, 'restrictionID', RestrictionType>(s, a.success, 'restrictionID'))
        else
            console.log('error setting restrictions');
    }
    const restrictionItems = React.useMemo(() => (restrictions[0] || []).map(mapRestrictionToDraggable), [restrictions[0]]);
    if(fotv.state.restrictions == undefined)
        return <p>idiot</p>;
    return <div className="flex flex-col h-full gap-4">
        <EditRestrictionModal openRestrictionID={editRestrictionID} setOpen={() => {setEditRestrictionID(null)}}/>
        <div className='flex grow-[1] basis-0 w-full overflow-hidden'>
                {((fotv.providerState == ProviderState.SUCCESS) ? <DraggableGrid gridData={mapRestrictionData(fotv, setEditRestrictionID, props.editing)} editing={props.editing} addGroup={() => {
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
                }}/> : <>Loading...</>)}
        </div>
        <div className='flex flex-row gap-4 text-2xl'>
            <button className={'w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded' + (props.editing ? ' bg-blue-700' : '')} onClick={(e) => {
                e.preventDefault();
                props.setEditing((e) => !e);
            }}>Toggle Edit Mode</button>
            {props.editing ? <DraggingContext.Consumer>{(drag) => <>
            <div className='rounded border-2 border-green-500 pr-2 cursor-move' draggable onDragStart={(e) => {
                    drag.setDrag({dragging: true, type: NewAction, itemID: undefined});
            }}><Plus className='inline text-green-500'/><p className='inline align-middle'>New Restriction</p>
            </div>
            <div className='rounded border-2 border-red-500 pr-2' onDragOver={(e) => {
                if(drag.drag.type == MoveAction){
                    e.preventDefault();
                }}} onDrop={(e) => {
                    const restrictionToDelete = fotv.state.restrictions.find((a) => a.restrictionID == drag.drag.itemID);
                    if(restrictionToDelete != undefined){
                        const items = getItemsToChangeDisplayOrder(restrictionItems,restrictionToDelete.displayOrder,restrictionToDelete.groupID,false);
                        if(items.length > 0)
                            putRestriction.sendWithParams(null, tempParams)(makePostJSON(items.map(mapDraggableToRestriction))).then();
                    }
                    const extra = getItemsToChangeDisplayOrder(restrictionItems, restrictionToDelete.displayOrder, restrictionToDelete.groupID, false);
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
                <X className='inline text-red-500'/>
                <p className='inline align-middle'>Delete Restriction</p>
            </div>
        </>}</DraggingContext.Consumer> : <></>}
        </div>
    </div>
}

type DraggableGridItem = {title: string, itemID: number, groupID: number, displayOrder: number, display?: React.ReactNode}

type DraggableGridGroup = {title: string, groupID: number}

type DraggableGridData = {items: DraggableGridItem[], groups: DraggableGridGroup[]}

function DraggableGrid(props: { gridData: DraggableGridData, editing: boolean, addGroup: () => void, handleDrop: HandleDropType }) {
    return <div className='grid grid-cols-4 gap-4 w-full max-w-full overflow-scroll custom-scrollbar hidden-x-scrollbar auto-rows-[calc(50%-1rem)]'>
        {props.gridData.groups.map((g) => <DraggableGroup editing={props.editing} group={g} items={props.gridData.items} handleDrop={props.handleDrop} key={g.groupID}/>)}
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
        }}><img draggable={false} src={getImageSRC(a.imageID, versionByID)} className='block absolute h-full mx-auto w-full object-contain'/></div>
    }))
}

function getItemsToChangeDisplayOrder(items: DraggableGridItem[], displayOrder: number, groupID: number, increase: boolean): Partial<DraggableGridItem>[] {
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
        console.log(e.dataTransfer.files[0]);
        const suffix = findFileExtension(e.dataTransfer.files[0].name);
        const current = fotv.state.logoImages.find((a) => a.displayOrder == displayOrder && a.imageType == groupID);
        uploadImage(current == undefined ? null : current.imageID,suffix).sendRaw(tempParams, formData).then((b) => {
            if(b.status == 200){
                console.log(b);
                if(current == undefined){
                    console.log('making new');
                    //alert('making new');
                    putLogoImage.sendWithParams(asc, tempParams)(makePostJSON([{title: 'NEW', displayOrder: displayOrder, imageType: groupID, imageID: b.data.imageID}])).then(updateLogoImagesLocal)
                }
                console.log(b.data);
                images[1]((im) => mergeTable<LogoImageType, 'logoImageID', LogoImageType>(im, [b.data], 'logoImageID'));
            }else{
                console.log(b);
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
    return <div className='flex grow-[2] flex-col space-y-4 flex-grow overflow-scroll'>
        <div className='flex grow-[1] w-[600px] mx-auto basis-0'>
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "AP Sliding Image",
                    groupID: -3
                }
            }
            items={mappedItems.filter((a) => a.groupID == -3)}
            handleDrop={handleDrop}
            />
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "JP Sliding Image",
                    groupID: -4
                }
            }
            items={mappedItems.filter((a) => a.groupID == -4)}
            handleDrop={handleDrop}
            />
        </div>
        <div className='flex grow-[1] w-[300px] mx-auto basis-0'>
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "Main Logo Image",
                    groupID: -2
                }
            }
            items={mappedItems.filter((a) => a.groupID == -2)}
            handleDrop={handleDrop}
            />
            <DraggableGroup cols={1} rows={1} hideX={true} editing={true} group={
                {
                    title: "Background Image",
                    groupID: -5
                }
            }
            items={mappedItems.filter((a) => a.groupID == -5)}
            handleDrop={handleDrop}
            />
        </div>
        <div className='flex grow-[1] basis-0'>
            <DraggableGroup cols={bigCols} rows={1} hideX={true} editing={true} group={
                {
                    title: "Big Images",
                    groupID: 0
                }
            }
            items={itemsBig}
            handleDrop={handleDrop}
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
            />
        </div>
        <div className='rounded border-2 border-red-500 pr-2' onDragOver={(e) => {
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
                    const toSend = getItemsToChangeDisplayOrder(mappedItems, draggedImage.displayOrder, draggedImage.imageType, false);
                    if(toSend.length > 0){
                        putLogoImage.sendWithParams(null, tempParams)(makePostJSON(toSend.map((a) => ({...a, logoImageID: a.itemID, itemID: undefined})))).then((a) => {
                            if(a.type == 'Success')
                                logoImageSet[1]((b) => mergeTable<LogoImageType, 'imageID', LogoImageType>(b, a.success, 'imageID'));
                            else
                                console.log('Server error');
                        })
                    }
            }}>
                <X className='inline text-red-500'/>
                <p className='inline align-middle'>Delete Image</p>
            </div>
    </div>
}

type DragInfo = {dragging: boolean, type: string, itemID: number}

const defaultDragging: {drag: DragInfo, setDrag: React.Dispatch<React.SetStateAction<DragInfo>>} = {drag: {dragging: false, type: undefined, itemID: undefined}, setDrag: () => {}};

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
            const draggedItem = currentItems.find((a) => a.itemID == itemID);
            if(draggedItem != undefined){
                toSend = toSend.concat(getItemsToChangeDisplayOrder(currentItems, draggedItem.displayOrder, draggedItem.groupID, false))
            }
            if(currentItemID != undefined){
                toSend = toSend.concat(getItemsToChangeDisplayOrder(currentItems, displayOrder, groupID, true))
            }
        //}
        toSend.push({itemID: itemID, groupID: groupID, displayOrder: displayOrder})
        updateItems(toSend);
    }else{
        handleCreate(e, displayOrder, groupID, getItemsToChangeDisplayOrder(currentItems, displayOrder, groupID, true));
    }
    setDrag(defaultDragging.drag);
}

//onDragOver={(e) => {e.preventDefault()}} onDrop={handleDrop(props.group.groupID)}

function isSlotAcceptableForDrag (e: React.DragEvent<HTMLDivElement>, drag: DragInfo, displayOrder: number, currentItemID: number, groupID: number, maxDisplayOrderForGroup: number){
    console.log(currentItemID);
    console.log(drag.itemID);
    return !drag.dragging ||((currentItemID == undefined || (drag.itemID != currentItemID)) && displayOrder < maxDisplayOrderForGroup);
}

function DraggableGroupBucket(props: {handleDrop:HandleDropType, currentItemID: number, children: React.ReactNode, editing?: boolean, groupID: number, displayOrder: number, maxDisplayOrderForGroup: number}) {
    return <DraggingContext.Consumer>{(drag) => <div className={'w-full border-2' + (drag.drag.dragging ? ' border-red-200' : '') + (props.editing ? ' rounded-md' : ' border-transparent')} onDragOver={(e) => {
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

function DraggableGroup(props: {editing: boolean, group: DraggableGridGroup, items: DraggableGridItem[], handleDrop: HandleDropType, cols?: number, rows?: number, hideX?: boolean, }){
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
    return <div className='flex flex-col grow-[1] bg-background rounded-sm'>
                <div className='flex flex-row w-full'>
                    <h1 className='p-2 flex'>
                        {props.group.title}
                    </h1>
                    {
                    props.editing ? 
                    <button className='flex ml-auto' onClick={(e) => {
                        e.preventDefault();
                        mc.pushAction(new ActionConfirmDelete(props.group.groupID));
                    }}>
                        {!props.hideX && <X className='align-middle inline mr-0 text-red-900' height='100%'/>}
                    </button>
                     : <></>}
                </div>
            <div className={'flex grow-[1] grid p-2 gap-1'} style={{
                gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))',
                gridTemplateRows: 'repeat(' + rows + ', minmax(0, 1fr))'
        }}>
            {allGroupBuckets.map((i) => <DraggableGroupBucket currentItemID={byDisplayOrder[i] !== undefined ? byDisplayOrder[i].itemID : undefined} handleDrop={props.handleDrop} groupID={props.group.groupID} displayOrder={i} editing={props.editing} maxDisplayOrderForGroup={getMaxDisplayOrderForGroup(props.items, props.group.groupID, maxDisplayOrder)} key={'i' + i + 'item' + (byDisplayOrder[i] || {itemID: 0}).itemID}>
            {(byDisplayOrder[i] !== undefined) ? byDisplayOrder[i].display : <></>}
                </DraggableGroupBucket>)}
        </div>
    </div>
}

function RestrictionInternal(props: {title: React.ReactNode}){
    return <div className="b-black">{props.title}</div>
}

function Restriction(props: {restriction: FOTVType['restrictions'][number], editing: boolean, setRestrictions: React.Dispatch<React.SetStateAction<FOTVType['restrictions']>>, editRestriction: (restrictionID: number) => void}){
    const fotv = React.useContext(FOTVContext);
    return <DraggingContext.Consumer>{(drag) => <div className={'rounded-sm border-2 w-full h-full' + (props.editing ? ' cursor-move' : ' cursor-pointer') + (props.restriction.active ? ' border-red-400' : '')} style={{color: props.restriction.textColor, backgroundColor: props.restriction.backgroundColor, fontWeight: props.restriction.fontWeight}} draggable={props.editing} onDragStart={(e) => {
        e.dataTransfer.setData('type', MoveAction);
        e.dataTransfer.setData('itemID', String(props.restriction.restrictionID));
        drag.setDrag({dragging: true, type: MoveAction, itemID: props.restriction.restrictionID});
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