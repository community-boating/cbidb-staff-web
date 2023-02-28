import { DefaultModalBody, ModalContext, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';
import { option } from 'fp-ts';
import { signoutTypesHR } from '../../../../pages/dockhouse/signouts/Constants';
import Button from 'components/wrapped/Button';
import { EditSignoutType } from '../../../../pages/dockhouse/signouts/StateTypes';
import RadioGroup from 'components/wrapped/RadioGroup';
import { AppStateContext } from 'app/state/AppStateContext';
import { SignoutActionMode, SignoutCombinedType, EditSignoutState } from './SignoutCombinedType';
import { putSignout, SignoutTablesState, SignoutType } from 'async/staff/dockhouse/signouts';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { RatingsType } from 'async/staff/dockhouse/ratings';
import * as moment from 'moment';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
import BoatIcon, { BoatSelect } from '../BoatIcon';
import { DetailedPersonInfo, AddEditCrew, getCrewActions } from '../SkipperInfo';
import { CreateSignoutType } from 'async/staff/dockhouse/create-signout';
import { ActionModalPropsWithState, getInfo, subStateWithSet } from '../ActionModalProps';
import SignoutNumbersDropdown from './SignoutNumbersDropdown';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import ActionBasedEditor, { ActionActionType, EditAction } from 'components/ActionBasedEditor';
import { EditSignoutActionModalState } from './EditSignoutType';
import { UpdateSignoutAction } from '../member-action/Actions';

export function DotBox(props: {className?: string, children: React.ReactNode}){
    return <div className={"my-5 py-5 border-dashed border-2 grow-[1] " + props.className}>
        {props.children}
    </div>
}

export function DialogOutput(props: {children: React.ReactNode}){
    return <div className="bg-card w-full">{props.children}</div>;
}

const signoutNumberKeys: (keyof SignoutCombinedType)[] = ['boatNum', 'sailNum', 'hullNum'];

function setBoatIdAction(actions: ActionActionType<SignoutCombinedType>){
    return (boatId: option.Option<number>) => {
        actions.addAction(new UpdateSignoutAction('boatId', boatId));
    }
}

export function EditSignout(props: {current: SignoutCombinedType, actions: ActionActionType<SignoutCombinedType>, mode: SignoutActionMode}){
    const [dialogOutput, setDialogOutput] = React.useState<option.Option<string>>(option.none);
    const crewActions = getCrewActions(props);
    const numbersSorted = React.useMemo(() => Object.entries(props.current).filter((a) => signoutNumberKeys.contains(a[0] as any)).sort((a, b) => (signoutNumberKeys.indexOf(a[0] as any) - signoutNumberKeys.indexOf(b[0] as any))).map((a) => a[1] as option.Option<number | string>), [props.current]);
    console.log(numbersSorted);
    return (
    <div className="flex flex-col grow-[1] gap-5">
        <div className="flex flex-row grow-[0] gap-5">
            {props.current.currentPeople.map((a, i) => (<DetailedPersonInfo key={a.personId} currentPerson={props.current.currentPeople[i]} mode={props.mode} setTesting={(a) => {
                crewActions.setTesting(i, a);
            }}/>))}
            <AddEditCrew currentPeople={props.current.currentPeople} {...crewActions} mode={props.mode} />
        </div>
        <div className="flex flex-row grow-[1]">
            <DialogOutput>
                <p>Dialog Output</p>
                <p>{dialogOutput.isSome() ? dialogOutput.value : <></>}</p>
            </DialogOutput>
        </div>
        <div className="flex flex-row grow-[3]">
            <div className="w-full flex flex-col">
                <p>Boat Type</p>
                <BoatIcon boatId={props.current.boatId} setBoatId={setBoatIdAction(props.actions)}/>
                <div className="flex flex-row gap-5 py-5">
                    <div className="flex flex-col items-end gap-5">
                        <BoatSelect tabIndex={-1} boatId={props.current.boatId} setBoatId={setBoatIdAction(props.actions)} autoWidth nowrap></BoatSelect>
                    </div>
                    <div className="flex flex-col items-end gap-5">
                        <SignoutNumbersDropdown numbers={numbersSorted} setNumber={(i, v) => {
                            props.actions.addAction(new UpdateSignoutAction(signoutNumberKeys[i], v as any))
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export function getSkipper(state: SignoutCombinedType){
    const skipperPeople = state.currentPeople.find((a) => a.isSkipper);
    return skipperPeople ? option.some(skipperPeople) : option.none;
}

export function convertToCreateSignout(state: SignoutCombinedType): CreateSignoutType{
    const skipper = getSkipper(state);
    if(!skipper.isSome()){
        throw "bad";
    }
    return {
        skipperPersonId: skipper.value.personId,
        skipperCardNumber: skipper.value.cardNumber,
        skipperTestRatingId: state.testRating,
        programId: MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM,
        boatId: state.boatId.getOrElse(undefined),
        sailNumber: state.sailNum,
        hullNumber: state.hullNum,
        classSessionId: option.none,
        isRacing: state.signoutType.getOrElse(undefined) == "R",
        dockmasterOverride: false,
        didInformKayakRules: true,
        signoutCrew: state.currentPeople.filter((a) => !a.isSkipper).map((a) => {
            return ({
                personId: a.personId,
                cardNumber: a.cardNumber,
                testRatingId: a.testRatingId
            });
        })
    }
}

export function adaptMemberState(state: SignoutCombinedType, currentRow: SignoutTablesState): SignoutTablesState {
    const skipperOrFirstTester = state.currentPeople.find((a) => a.isSkipper) || state.currentPeople.find((a) => a.isTesting);
    return {
        ...currentRow,
        boatId: state.boatId.getOrElse(undefined),
        hullNumber: state.hullNum,
        sailNumber: state.hullNum,
        $$crew: state.currentPeople.filter((a) => !a.isSkipper).map((a) => ({$$person:{personId: a.personId, nameFirst: a.nameFirst, nameLast: a.nameLast}, personId: option.some(a.personId), crewId: -1, signoutId: state.signoutId, cardNum: option.none, startActive: option.none, endActive: option.none})),
        $$skipper: {...currentRow.$$skipper, personId: skipperOrFirstTester.personId, nameFirst: skipperOrFirstTester.nameFirst, nameLast: skipperOrFirstTester.nameLast, $$personRatings: skipperOrFirstTester.personRatings.map((a) => ({...a, personId: skipperOrFirstTester.personId}))}
    };
}
const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
    return <h1 className={"flex " + (checked ? "text-boathouseblue" : "")} key={index}>{display}</h1>;
};

const setSignoutType = (actions: ActionActionType<SignoutCombinedType>) => {
    return (value) => {
        actions.addAction(new UpdateSignoutAction('signoutType', value));
    }
}

export function EditSignoutModal(props: ActionModalPropsWithState<SignoutCombinedType, EditSignoutActionModalState>) {
    const ratings = React.useContext(RatingsContext);
    if(!props){
        return<></>;
    }
    
    const [actions, setActions] = subStateWithSet(props.state, props.setState, 'actions');
    return <DefaultModalBody>
        <ActionBasedEditor originalData={props.info} actions={actions} setActions={setActions} makeChildren={(current, actions) => {
            const mode = (current.signoutType.isSome() && current.signoutType.value == SignoutType.TEST) ? SignoutActionMode.TESTING : SignoutActionMode.SIGNOUT;
            return <>
                <ModalHeader className="font-bold text-2xl gap-1">
                    <RadioGroup className="flex flex-row" value={current.signoutType} setValue={setSignoutType(actions)} makeChildren={signoutTypesHR.map((a, i) => ({ value: a.value, makeNode: (c, s) => { return makeNode(i, a.display)(c, s); } }))} />
                </ModalHeader>
                <div className="p-5">
                    <EditSignout current={current} actions={actions} mode={mode} />
                </div>
                <SubmitEditSignout current={current} actions={actions}/>
            </>
        }}/>
        
    </DefaultModalBody>;
}



function SubmitEditSignout(props: { current: SignoutCombinedType; actions: ActionActionType<SignoutCombinedType>; }) {
    const asc = React.useContext(AppStateContext);
    const signouts = React.useContext(SignoutsTodayContext);
    return <div className="flex flex-row gap-2 ml-auto mr-0 mt-auto mb-0">
        <ModalContext.Consumer>
            {(value) => {
                return <>
                <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => {
                    value.setOpen(false);
                }}>Cancel</Button>
                <Button className={buttonClasses + " " + buttonClassActive} spinnerOnClick onClick={(e) => {
                    const adaptedToSignout = adaptMemberState(props.current, signouts.signouts.find((a) => a.signoutId == props.current.signoutId));
                    return putSignout.sendJson(asc, adaptedToSignout).then((a) => {
                        if(a.type == "Success"){
                            signouts.setSignouts((s) => s.map((b) => {
                                if(b.signoutId == adaptedToSignout.signoutId)
                                    return adaptedToSignout;
                                return b;
                            }))
                            value.setOpen(false);
                        }
                    });
                }}>Save</Button>
        </>
        }}
        </ModalContext.Consumer>
    </div>;
}
