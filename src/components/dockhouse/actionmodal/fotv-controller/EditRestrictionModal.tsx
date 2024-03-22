import { FOTVContext } from 'async/providers/FOTVProvider';
import { FOTVType, ImageType, LogoImageType, RestrictionConditionType, RestrictionType, deleteRestrictionCondition, putRestriction, putRestrictionCondition, uploadLogoImage } from 'async/staff/dockhouse/fotv-controller';
import Button from 'components/wrapped/Button';
import { SelectInput, ValidatedTextInput } from 'components/wrapped/Input';
import Modal, { DefaultModalBody, ModalContext, ModalHeader } from 'components/wrapped/Modal';
import { makePostJSON } from 'core/APIWrapper';
import { tempParams } from 'core/AsyncStateProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import { buttonClasses, buttonClassActive } from '../styles';
import { findFileExtension, getImageSRC, imageVersionByID, mergeTable } from 'pages/dockhouse/fotv-controller/shared';
import { subStateWithSet } from '../ActionModalProps';
import { X } from 'react-feather';
import ActionBasedEditor, { EditAction } from 'components/ActionBasedEditor';
import { ValidatedTimeInput } from 'pages/dockhouse/signouts/SignoutsTable';
import * as moment from 'moment';
import { Flag, FlagStatusIcon, FlagStatusIcons } from 'components/dockhouse/FlagStatusIcons';

export function setRestrictionPartial(setRestrictions: React.Dispatch<React.SetStateAction<FOTVType>>, values: Partial<FOTVType['restrictions'][number]>) {
    return putRestriction.sendWithParams(null, tempParams)(makePostJSON([values])).then((a) => {
        if (a.type == 'Success')
            setRestrictions((fotv) => ({...fotv, restrictions: [...fotv.restrictions.map((r) => r.restrictionID == a.success[0].restrictionID ? a.success[0] : r)]}));
        else
            alert('error adding restriction');
    });
}

function ColorSelector(props: { value: string, setValue: (v: string) => void }) {
    const timeoutID = React.useRef<NodeJS.Timeout>();
    timeoutID.current = setTimeout(() => { }, 0);
    const stop = () => {
        if (timeoutID.current)
            clearInterval(timeoutID.current)
    }
    const start = (value: string) => {
        timeoutID.current = setTimeout(() => {
            timeoutID.current = undefined;
            props.setValue(value)
        }, 150);
    }
    return <input type='color' value={props.value} onChange={(e) => {
        e.preventDefault();
        stop();
        start(e.target.value);
    }} />
}

type EditRestrictionActionType = {restriction: RestrictionType, relevantConditions: RestrictionConditionType[]};

function isDelete(u): u is DeleteRestrictionConditionAction{
    return u.delete == true;
}

class DeleteRestrictionConditionAction extends EditAction<EditRestrictionActionType>{
    conditionID: number;
    delete = true;
    constructor(conditionID: number){
        super();
        this.conditionID = conditionID;
    }
    applyActionLocal(data) {
        return {...data, relevantConditions: data.relevantConditions.filter((a) => a.conditionID != this.conditionID)};
    }
}

var newCounter = -1;

function isCreate(u): u is CreateRestrictionConditionAction{
    return u.create == true;
}

class CreateRestrictionConditionAction extends EditAction<EditRestrictionActionType[]>{
    value: RestrictionConditionType;
    create = true;
    constructor(value: Omit<RestrictionConditionType, 'conditionID'>){
        super();
        this.value = {...value, conditionID: newCounter};
        newCounter -= 1;
    }
    applyActionLocal(data) {
        return {...data, relevantConditions: data.relevantConditions.concat({...this.value})}
    }
}

function isUpdateCondition(u): u is UpdateRestrictionConditionAction{
    return u.updateCondition == true;
}

class UpdateRestrictionConditionAction extends EditAction<RestrictionConditionType[]>{
    value: Partial<RestrictionConditionType> & {conditionID: number}
    updateCondition = true;
    constructor(value: Partial<RestrictionConditionType> & {conditionID: number}){
        super();
        this.value = value;
    }
    applyActionLocal(data) {
        return {...data, relevantConditions: data.relevantConditions.map((a) => a.conditionID == this.value.conditionID ? {...a, ...this.value} : a)};
    }
}

function isUpdate(u): u is UpdateRestrictionAction{
    return u.update == true;
}


class UpdateRestrictionAction extends EditAction<EditRestrictionActionType>{
    value: Partial<RestrictionType>
    update = true;
    constructor(value: Partial<RestrictionType>){
        super();
        this.value = value;
    }
    applyActionLocal(data){
        return {...data, restriction: {...data.restriction, ...this.value}}
    }
}

function RestrictionConditionInfo(props: {condition: RestrictionConditionType, action}){
    if(props.condition.conditionType.isNone())
        return <div>Select A Type</div>;
    return <div>
        {props.condition.conditionType.value == 0 ? <ConditionTimeInfo {...props}/> : <></>}
        {props.condition.conditionType.value == 1 ? <ConditionStateInfo {...props}/> : <></>}
    </div>
}

function FlagDisplay(props: {flag: Flag}){
    return <div className='flex flex-row w-full'>
        <label>{props.flag.hr}</label>
        <FlagStatusIcon flag={props.flag} className='h-[1em] ml-auto mr-0 my-auto'/>
    </div>
}

function ConditionStateInfo(props: {condition: RestrictionConditionType, action}){
    return <div>
        <label>State Type:</label>
        <SelectInput controlledValue={props.condition.conditionInfo} updateValue={(v) => {
            props.action.addAction(new UpdateRestrictionConditionAction({conditionID: props.condition.conditionID, conditionInfo: v}))
        }} selectOptions={[{value: '0', display: 'Open'}, {value: '1', display: 'Closed'}, {value: '2', display: <FlagDisplay flag={FlagStatusIcons.G}/>}, {value: '3', display: <FlagDisplay flag={FlagStatusIcons.Y}/>}, {value: '4', display: <FlagDisplay flag={FlagStatusIcons.R}/>}]} autoWidth/>
    </div>
}

function ConditionTimeInfo(props: {condition: RestrictionConditionType, action}){
    return <ValidatedTimeInput rowForEdit={{conditionInfo: moment(props.condition.conditionInfo.getOrElse(''))}} columnId='conditionInfo' upper={moment().endOf('day')} lower={moment().startOf('day')} updateState={(a, b) => {
        props.action.addAction(new UpdateRestrictionConditionAction({conditionID: props.condition.conditionID, conditionInfo: option.some(b)}))
    }} validationResults={[]}/>
}

function RestrictionConditionList(props: {currentData: RestrictionConditionType[], currentRestrictionID: number, action}){
    
    return <div className='w-full flex flex-col relative'>
        <div className='h-[150px] overflow-scroll flex flex-col h-full gap-2'>
            {props.currentData.map((a) => <div className='flex flex-row gap-2'>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row'>
                        <label>Condition Type: </label>
                        <SelectInput controlledValue={a.conditionType} updateValue={(v) => {
                            props.action.addAction(new UpdateRestrictionConditionAction({conditionID: a.conditionID, conditionType: v, conditionInfo: option.none}))
                        } } selectOptions={[{ value: 0, display: 'Time' }, {value: 1, display: 'State'}]} />
                        <label>Condition Action:</label>
                        <SelectInput controlledValue={a.conditionAction} updateValue={(v) => {
                            props.action.addAction(new UpdateRestrictionConditionAction({conditionID: a.conditionID, conditionAction: v}))
                        } } selectOptions={[{ value: 0, display: 'Active' }, {value: 1, display: 'Deactivate'}, {value: 2, display: 'Toggle'}]} autoWidth />
                    </div>
                    <div className='flex flex-row'>
                        <label>Condition Info:</label>
                        <RestrictionConditionInfo condition={a} action={props.action}/>
                    </div>
                </div>
                <button className='ml-auto mr-0' onClick={(e) => {
                    e.preventDefault();
                    props.action.addAction(new DeleteRestrictionConditionAction(a.conditionID));
                } }>
                    <X color={'red'} />
                </button>
            </div>)}
        </div>
        <div>
            <button onClick={(e) => {
                props.action.addAction(new CreateRestrictionConditionAction({conditionAction: option.none, conditionInfo: option.none, conditionType: option.none}))
            } }>New Condition</button>
        </div>
    </div>
}

function resolveActions(actions, setRestrictionConditions: React.Dispatch<React.SetStateAction<RestrictionConditionType[]>>, setRestrictions: React.Dispatch<React.SetStateAction<RestrictionType[]>>, restrictionID: number){

    const deleteIds = [];

    const updatesByID = {};

    var restrictionUpdate = {};

    actions.forEach((a) => {
        if(isDelete(a) && a.conditionID >= 0){
            deleteIds.push(a.conditionID);
        }
        if(isCreate(a)){
            updatesByID[a.value.conditionID] = a.value;
        }
        if(isUpdateCondition(a)){
            updatesByID[a.value.conditionID] = {...(updatesByID[a.value.conditionID] || {}), ...a.value};
        }
        if(isUpdate(a)){
            restrictionUpdate = {...restrictionUpdate, ...a.value};
        }
    });

    if(deleteIds.length > 0){
        deleteRestrictionCondition.sendWithParams(null, tempParams)(makePostJSON(deleteIds.map((a) => ({conditionID: a})))).then((b) => {
            if (b.type == 'Success') {
                setRestrictionConditions((s) => s.filter((a) => !deleteIds.contains(a.conditionID)));
            } else {
                console.log('Error doing it');
            }
        });
    }

    var toUpdate = Object.values(updatesByID) as any;
    if(toUpdate.length > 0){
        putRestrictionCondition.sendWithParams(null, tempParams)(makePostJSON(toUpdate.map((a) => a.conditionID >= 0 ? a : {...a, conditionID: undefined}))).then((a) => {
            if(a.type == 'Success'){
                setRestrictionConditions((s) => mergeTable<RestrictionConditionType, 'conditionID', RestrictionConditionType>(s, a.success, 'conditionID'));
            }else{
                console.log('Issue doing it');
            }
        })
    }

    if(Object.keys(restrictionUpdate).length > 0){
        putRestriction.sendWithParams(null, tempParams)(makePostJSON([{...restrictionUpdate, restrictionID: restrictionID}])).then((a) => {
            if(a.type == 'Success'){
                setRestrictions((s) => s.map((b) => b.restrictionID != restrictionID ? b : a.success[0]))
            }else{
                console.log('Issue doing it');
            }
        })
    }

    //const deleteActions = deleteRestrictionCondition.send
    /*deleteRestrictionCondition.sendWithParams(null, tempParams)(makePostJSON({ conditionID: a.conditionID })).then((b) => {
        if (b.type == 'Success') {
        } else {
            console.log('Error doing it');
        }
    });*/
}

export default function EditRestrictionModal(props: { openRestrictionID: number, setOpen: (open: boolean) => void }) {
    //const [restriction, setRestriction] = React.useState<RestrictionType>(undefined);
    const fotv = React.useContext(FOTVContext);
    const versionByID = imageVersionByID(fotv);
    const image = subStateWithSet(fotv.state, fotv.setState, 'logoImages');
    //restriction != undefined && console.log(restriction.imageID);
    const restrictionConditions = subStateWithSet(fotv.state, fotv.setState, 'restrictionConditions');
    const [actions, setActions] = React.useState([]);
    const relevantConditions = fotv.state.restrictionConditions;//.filter((a) => a.restrictionID == props.openRestrictionID);
    const restriction = props.openRestrictionID != undefined ? fotv.state.restrictions.find((a) => a.restrictionID == props.openRestrictionID) : undefined;
    const restrictions = subStateWithSet(fotv.state, fotv.setState, 'restrictions');
    React.useEffect(() => {
        //if(props.openRestrictionID == undefined)
            //setRestriction(undefined);
        //else
            //setRestriction(fotv.state.restrictions.find((a) => a.restrictionID == props.openRestrictionID));
        setActions([]);
    }, [props.openRestrictionID]);
        const open = restriction != undefined;
        return open ? <Modal open={open} setOpen={props.setOpen}>
        <DefaultModalBody>
            <ModalHeader>
                <span className="text-2xl font-bold">Edit Restriction</span>
            </ModalHeader>
            <ActionBasedEditor originalData={{restriction: restriction, relevantConditions: relevantConditions}} makeChildren={(currentData, action) => <div className='grow-[1] flex flex-col'>
                    <ValidatedTextInput label='Title:' controlledValue={option.some(currentData.restriction.title)} updateValue={(v) => {
                        action.addAction(new UpdateRestrictionAction({title: v.getOrElse('') }));
                    }}/>
                <span>
                <label>Conditions:</label>
                <RestrictionConditionList currentData={currentData.relevantConditions} currentRestrictionID={restriction.restrictionID} action={action}/>
                <label>Text Color:</label>
                <ColorSelector value={currentData.restriction.textColor} setValue={(v) => {
                    action.addAction(new UpdateRestrictionAction({textColor: v }));
                }} />
                </span>
                <span>
                <label>Background Color:</label>
                <ColorSelector value={currentData.restriction.backgroundColor} setValue={(v) => {
                    action.addAction(new UpdateRestrictionAction({backgroundColor: v}));
                }} />
                </span>
                <span>
                <label>Priority:</label>
                    <input className='inline' type="checkbox" checked={currentData.restriction.isPriority} onChange={(e) => {
                        console.log("updating");
                        action.addAction(new UpdateRestrictionAction({isPriority: e.target.checked }));
                    }} />
                </span>
                <label>
                    Icon:
                    {currentData.restriction.imageID ? <X className='inline' color={'red'} onClick={(e) => {
                        e.preventDefault();
                        action.addAction(new UpdateRestrictionAction({imageID: option.none }));
                    }}/> : <></>}
                </label>
                <div className='h-[100px] w-[100px] border-black border-2 border-solid' onDragOver={(e) => {
                    e.preventDefault();
                }} onDrop={(e) => {
                    if(e.dataTransfer.files.length == 0){
                        return;
                    }
                    const formData = new FormData();
                    formData.append('image', e.dataTransfer.files[0]);
                    const suffix = findFileExtension(e.dataTransfer.files[0].name);
                    const imageID = currentData.restriction.imageID.isNone() ? undefined : currentData.restriction.imageID.value;
                    uploadLogoImage(imageID, suffix).sendRaw(tempParams, formData).then((a) => {
                        action.addAction(new UpdateRestrictionAction({imageID: option.some(a.data.imageID) }));
                        image[1]((s) => mergeTable<LogoImageType, 'logoImageID', LogoImageType>(s, [a.data], 'logoImageID'));
                    })
                    e.preventDefault();
                }}>
                    {currentData.restriction.imageID.isSome() ? <img src={getImageSRC(currentData.restriction.imageID.value, versionByID)}/> : <></>}
                </div>
                <label>Message:</label>
                <textarea cols={45} rows={15} value={currentData.restriction.message} onChange={(e) => {
                    e.preventDefault();
                    action.addAction(new UpdateRestrictionAction({message: e.target.value }));
                }}></textarea>
                <ModalContext.Consumer>{value =>
            <Button className={buttonClasses + " " + buttonClassActive} onClick={(e) => {
                e.preventDefault();
                value.setOpen(false);
                resolveActions(actions, restrictionConditions[1], restrictions[1], props.openRestrictionID);
                //return setRestrictionPartial(fotv.setState, restriction);
            }}>Update Restriction</Button>
        }</ModalContext.Consumer>
            </div>} actions={actions} setActions={setActions}/>
        </DefaultModalBody>
    </Modal> : <></>;
}