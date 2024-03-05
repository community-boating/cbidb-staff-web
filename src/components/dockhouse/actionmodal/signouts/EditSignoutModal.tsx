import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';
import { option } from 'fp-ts';
import { signoutTypesHR } from '../../../../pages/dockhouse/signouts/Constants';
import RadioGroup from 'components/wrapped/RadioGroup';
import { SignoutCombinedType } from './SignoutCombinedType';
import { SignoutTablesState, SignoutType } from 'async/staff/dockhouse/signouts';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { CreateSignoutType } from 'models/typerefs';
import { ActionModalPropsWithState, subStateWithSet } from '../ActionModalProps';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import ActionBasedEditor, { ActionActionType } from 'components/ActionBasedEditor';
import { EditSignoutActionModalState } from './EditSignoutType';
import { UpdateSignoutAction } from '../member-action/Actions';
import { MemberActionMode } from '../member-action/MemberActionType';
import { SubmitEditSignout } from './SubmitEditSignout';
import { EditSignout } from './EditSignout';

export function DotBox(props: {className?: string, children: React.ReactNode}){
    return <div className={"my-5 py-5 border-dashed border-2 grow-[1] " + props.className}>
        {props.children}
    </div>
}

export function DialogOutput(props: {children: React.ReactNode}){
    return <div className="bg-card w-full">{props.children}</div>;
}

export const signoutNumberKeys: (keyof SignoutCombinedType)[] = ['boatNum', 'sailNum', 'hullNum'];

export function setBoatIdAction(actions: ActionActionType<SignoutCombinedType>){
    return (boatId: option.Option<number>) => {
        actions.addAction(new UpdateSignoutAction('boatId', boatId));
    }
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
        skipperTestRatingId: skipper.value.testRatingId,
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

//TODO add test convert?
export function adaptMemberState(state: SignoutCombinedType, currentRow: SignoutTablesState): SignoutTablesState {
    const skipperOrFirstTester = state.currentPeople.find((a) => a.isSkipper) || state.currentPeople.find((a) => a.isTesting);
    return {
        ...currentRow,
        boatId: state.boatId.getOrElse(undefined),
        hullNumber: state.hullNum,
        sailNumber: state.hullNum,
        signoutType: state.signoutType.getOrElse(currentRow.signoutType),
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
            const mode = (current.signoutType.isSome() && current.signoutType.value == SignoutType.TEST) ? MemberActionMode.TESTING : MemberActionMode.SIGNOUT;
            return <>
                <ModalHeader className="font-bold text-2xl gap-1">
                    <RadioGroup className="flex flex-row" value={current.signoutType} setValue={setSignoutType(actions)} makeChildren={signoutTypesHR.map((a, i) => ({ value: a.value, makeNode: (c, s) => { return makeNode(i, a.display)(c, s); } }))} />
                </ModalHeader>
                <div className="p-5">
                    <EditSignout current={current} actions={actions} mode={mode} dialogOutput={option.none} />
                </div>
                <SubmitEditSignout current={current} actions={actions}/>
            </>
        }}/>
        
    </DefaultModalBody>;
}




