import { ModalContext, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';
import { option } from 'fp-ts';
import { signoutTypesHR, testResultsHR } from '../../../../pages/dockhouse/signouts/Constants';
import Button from 'components/wrapped/Button';
import { EditSignoutType } from '../../../../pages/dockhouse/signouts/StateTypes';
import RadioGroup from 'components/wrapped/RadioGroup';
import { AppStateContext } from 'app/state/AppStateContext';
import { SignoutActionMode, SignoutCombinedType, EditSignoutState } from './SignoutCombinedType';
import { putSignout, SignoutTablesState, SignoutType } from 'async/staff/dockhouse/signouts';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';
import { RatingsType } from 'async/staff/dockhouse/ratings';
import * as moment from 'moment';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
import { OptionalStringInput, SelectInput } from 'components/wrapped/Input';
import BoatIcon, { BoatSelect } from '../BoatIcon';
import { RatingsSelect } from '../class/ActionClassModal';
import { DetailedPersonInfo, AddEditCrew } from '../SkipperInfo';
import { CreateSignoutType } from 'async/staff/dockhouse/create-signout';
import { ActionModalPropsWithState } from '../ActionModalProps';

export function DotBox(props: {className?: string, children: React.ReactNode}){
    return <div className={"my-5 py-5 border-dashed border-2 grow-[1] " + props.className}>
        {props.children}
    </div>
}

export function DialogOutput(props: {children: React.ReactNode}){
    return <div className="bg-card w-full">{props.children}</div>;
}

export function EditSignout(props: {state: SignoutCombinedType, setState: React.Dispatch<React.SetStateAction<SignoutCombinedType>>, mode: SignoutActionMode}){
    const propsSorted = {...props, state: {...props.state, currentPeople: props.state.currentPeople}};
    const [dialogOutput, setDialogOutput] = React.useState<option.Option<string>>(option.none);
    const setBoatId = (boatId: option.Option<number>) => {
        props.setState({...props.state, boatId: boatId})
    };
    return (
    <div className="flex flex-col grow-[1] gap-5">
        <div className="flex flex-row grow-[0] gap-5">
            {props.state.currentPeople.map((a, i) => (<DetailedPersonInfo key={a.personId} {...propsSorted} index={i}/>))}
            <AddEditCrew {...propsSorted} />
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
                <BoatIcon boatId={props.state.boatId} setBoatId={setBoatId}/>
                <DotBox className="grow-[1] p-5">
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col items-end gap-5">
                            <BoatSelect boatId={props.state.boatId} setBoatId={setBoatId} autoWidth nowrap></BoatSelect>
                        </div>
                        <div className="flex flex-col items-end gap-5">
                            <OptionalStringInput label="Boat Number:" controlledValue={props.state.boatNum} updateValue={(v) => {props.setState((s) => ({...s, boatNum: v}))}}/>
                            <OptionalStringInput label="Hull Number:" controlledValue={props.state.hullNum} updateValue={(v) => {props.setState((s) => ({...s, hullNum: v}))}}/>
                            <OptionalStringInput label="Sail Number:" controlledValue={props.state.sailNum} updateValue={(v) => {props.setState((s) => ({...s, sailNum: v}))}}/>
                        </div>
                        <div className="flex flex-col items-end gap-5">
                            <SelectInput label="Signout Type:" className="w-[200px]" controlledValue={props.state.signoutType} updateValue={(v) => {props.setState((s) => ({...s, signoutType: v}))}} selectOptions={signoutTypesHR} autoWidth></SelectInput>
                            <SelectInput label="Test Type:" className="w-[200px]" controlledValue={option.none} updateValue={undefined} selectOptions={testResultsHR} autoWidth></SelectInput>
                            <RatingsSelect label="Ratings:" className="w-[200px]" ratingId={props.state.testRating} setRating={(v) => {props.setState((s) => ({...s, testRating: v}))}}/>
                        </div>
                    </div>
                </DotBox>
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

export function adaptSignoutState(state: SignoutTablesState, ratings: RatingsType): EditSignoutState {
    return {
        currentPeople: [{
            personId: state.$$skipper.personId,
            cardNumber: state.cardNum.getOrElse(undefined),
            nameFirst: state.$$skipper.nameFirst,
            nameLast: state.$$skipper.nameLast,
            bannerComment: state.comments,
            specialNeeds: option.none,
            personRatings: state.$$skipper.$$personRatings.map((a) => ({ ...a, ratingName: ratings.find((b) => b.ratingId == a.ratingId).ratingName, status: "" })),
            isSkipper: true,
            isTesting: state.signoutType == SignoutType.TEST,
            testRatingId: state.testRatingId,
            activeMemberships: [{
                assignId: 0,
                membershipTypeId: 0,
                startDate: option.some(moment()),
                expirationDate: option.none,
                discountName: option.none,
                isDiscountFrozen: false,
                hasGuestPrivs: true,
                programId: option.some(state.programId)
            }],
            sortOrder: 0
        }].concat((state.$$crew.map((a, i) => ({
            personId: a.$$person.personId,
            cardNumber: a.cardNum.getOrElse(undefined),
            nameFirst: a.$$person.nameFirst,
            nameLast: a.$$person.nameLast,
            bannerComment: option.none,
            specialNeeds: option.none,
            personRatings: [],
            isSkipper: false,
            isTesting: state.signoutType == SignoutType.TEST,
            testRatingId: state.testRatingId,
            activeMemberships: [{
                assignId: 0,
                membershipTypeId: 0,
                startDate: option.some(moment()),
                expirationDate: option.none,
                discountName: option.none,
                isDiscountFrozen: false,
                hasGuestPrivs: true,
                programId: option.some(state.programId)
            }],
            sortOrder: 1 + i
        })))),
        boatId: option.some(state.boatId),
        signoutType: option.some(state.signoutType),
        boatNum: option.none,
        hullNum: state.hullNumber,
        sailNum: state.sailNumber,
        testRating: state.testRatingId,
        signoutId: state.signoutId
    };
}
function adaptMemberState(state: SignoutCombinedType, currentRow: SignoutTablesState): SignoutTablesState {
    return {
        ...currentRow,
        boatId: state.boatId.getOrElse(undefined),
        hullNumber: state.hullNum,
        sailNumber: state.hullNum,
        //$$skipper: state.currentPeople
    };
}
const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
    return <h1 className={"flex " + (checked ? "text-boathouseblue" : "")} key={index}>{display}</h1>;
};

export function EditSignoutModal(props: ActionModalPropsWithState<EditSignoutType, SignoutCombinedType>) {
    const ratings = React.useContext(RatingsContext);
    React.useEffect(() => {
        props.setState(adaptSignoutState(props.info.currentSignout, ratings));
    }, [props.info.currentSignout]);
    if(!props.state){
        return<></>;
    }
    const mode = (props.state.signoutType.isSome() && props.state.signoutType.value == SignoutType.TEST) ? SignoutActionMode.TESTING : SignoutActionMode.SIGNOUT;
    return <>
        <ModalHeader className="font-bold text-2xl gap-1">
            <RadioGroup className="flex flex-row" value={props.state.signoutType} setValue={(v) => props.setState((s) => ({ ...s, signoutType: v }))} makeChildren={signoutTypesHR.map((a, i) => ({ value: a.value, makeNode: (c, s) => { return makeNode(i, a.display)(c, s); } }))} />
        </ModalHeader>
        <div className="w-[80vw] h-[80vh] p-5">
            <EditSignout state={props.state} setState={props.setState} mode={mode} />
        </div>
        <SubmitEditSignout state={props.state} currentRow={props.info.currentSignout} />
    </>;
}
function SubmitEditSignout(props: { state: SignoutCombinedType; currentRow: SignoutTablesState; }) {
    const asc = React.useContext(AppStateContext);
    return <div className="flex flex-row gap-2 ml-auto mr-0">
        <ModalContext.Consumer>
            {(value) => {
                return <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => {
                    value.setOpen(false);
                }}>Cancel</Button>;
            }}
        </ModalContext.Consumer>
        <Button className={buttonClasses + " " + buttonClassActive} onClick={(e) => {
            const adaptedToSignout = adaptMemberState(props.state, props.currentRow);
            return putSignout.sendJson(asc, adaptedToSignout).then((a) => {
                console.log(a);
            });
        }}>Save</Button>
    </div>;
}
