import { Button, Table } from "reactstrap";

import * as React from "react";
import { SelectOption, ValidatedTextInput } from "components/wrapped/Input";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import * as t from "io-ts";
import { getPersonByCardNumber, putSignoutCrew, signoutCrewValidator } from "async/staff/dockhouse/signouts-tables";
import { Plus, X } from "react-feather";
import { MultiHover } from "../MultiHover";
import { EditModal, EditModalCommonProps } from "./EditModal";
import * as moment from "moment";
import { DefaultDateTimeFormat } from "util/OptionalTypeValidators";
import { deoptionifyProps, OptionifiedProps, optionifyProps } from "util/OptionifyObjectProps";
import { BoatTypesValidatorState, SignoutsTablesExtraState, SignoutTablesState } from "../StateTypes";
import { AppStateContext } from "app/state/AppStateContext";

type SignoutCrewState = t.TypeOf<typeof signoutCrewValidator>;
type SignoutCrewStateOptional = OptionifiedProps<SignoutCrewState>;

type UpdateCrewType = (crew: SignoutCrewStateOptional, active: boolean) => Promise<any>;

const optionToMoment = (value: Option<string>) => option.isSome(value) ? moment(value.value) : moment();

const updateCrewDates = (crew: SignoutCrewState | SignoutCrewStateOptional, active: boolean) => {
    crew.endActive = active ? option.none : option.some(moment().format(DefaultDateTimeFormat));
    crew.startActive = option.some(optionToMoment(!active ? crew.startActive : option.none).format(DefaultDateTimeFormat));
}

export function isCrewValid(crew: SignoutCrewState[], boatId: number, boatTypes: BoatTypesValidatorState, active: boolean) {
	const boat = boatTypes.find((a) => a.boatId == boatId);
	if (boat === undefined) {
		return [];
	}
	const crewLength = crew.filter((a) => option.isNone(a.endActive)).length;
	if (boat.maxCrew < crewLength) {
		if(active){
			return ["Too many crew members (" + boat.maxCrew + ")"];
		}else{
			return;
		}
	}
	if (boat.minCrew > crewLength) {
		if(!active){
			return ["Not enough crew members (" + boat.minCrew + ")"];
		}else{
			return;
		}
	}
}

export const EditCrewModal = (props: EditModalCommonProps & { updateCurrentRow: (row: SignoutTablesState) => void, boatTypes: BoatTypesValidatorState, boatTypesHR: SelectOption<number>[] }) => {
    const [errors, setErrors] = React.useState([] as string[]);
    const asc = React.useContext(AppStateContext);
    const updateCrew: UpdateCrewType = (crewMember, active) => {

        var foundCrew: SignoutCrewState = null;

        const newCrew = props.currentRow.$$crew.map((a) => {
            if(foundCrew === null && (a.crewId == crewMember.crewId.getOrElse(-1) || (option.isNone(crewMember.crewId) && a.cardNum.getOrElse("") == crewMember.cardNum.getOrElse("") && a.personId.getOrElse(-1) == crewMember.personId.getOrElse(-1)))){
                const A = {...a}
                updateCrewDates(A, active);
                foundCrew = A;
                return A;
            }else{
                return a;
            }
        });

        const crewBoatErrors = isCrewValid(newCrew, props.currentRow.boatId, props.boatTypes, active);
        if (crewBoatErrors !== undefined) {
            setErrors(crewBoatErrors);
            console.log("boatError");
            return Promise.resolve();
        }

        if(foundCrew === null){
            console.log("was null");
            updateCrewDates(crewMember, active);
            foundCrew = deoptionifyProps(crewMember, signoutCrewValidator);
            delete foundCrew.crewId;
            newCrew.push(foundCrew);
        }

        return putSignoutCrew.sendJson(asc, foundCrew).then((a) => {
            if (a.type === "Success") {
                //TODO fix this eventually to not use old person, probably fine for now
                const old = foundCrew.$$person;
                Object.assign(foundCrew, deoptionifyProps(a.success, signoutCrewValidator));
                console.log(foundCrew);
                foundCrew.$$person = old;
                props.updateCurrentRow({
                    ...props.currentRow, $$crew: newCrew
                });
            } else {
                console.log(a);
                console.log("bad problem");
                setErrors(["Server error deleting crew"]);
            }
        });
    }
    return <>
        <EditModal {...props} errors={errors} setErrors={setErrors} headerChildren={
            "Edit Crew"
        }>
            {props.currentRow !== undefined ? <>
                <h1>Active Crew</h1>
                <CrewTable row={props.currentRow} isFormer={false} updateCrew={updateCrew} />
                <h1>Past Crew</h1>
                <CrewTable row={props.currentRow} isFormer={true} updateCrew={updateCrew}/>
                <h1>Add Crew</h1>
                <AddCrew row={props.currentRow} updateCrew={updateCrew} setErrors={setErrors} boatTypes={props.boatTypes} />
            </> : <></>}
        </EditModal>
    </>
};



class ThrottledUpdater {
    timerID: NodeJS.Timeout;
    timeout: number;
    handleUpdate: () => void;
    constructor(timeout: number, handleUpdate: () => any) {
        this.timerID = undefined;
        this.timeout = timeout;
        this.handleUpdate = handleUpdate;
        this.startUpdate = this.startUpdate.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    startUpdate() {
        this.cancel();
        this.timerID = setTimeout(function () {
            this.timerID = undefined;
            this.handleUpdate();
        }.bind(this), this.timeout);
    }
    cancel() {
        if (this.timerID != undefined) {
            clearTimeout(this.timerID);
        }
    }
    isWaiting(){
        return this.timerID != undefined;
    }

}

const crewTableHeaderStyle = {width: "25%"};

export const CrewTable = (props: { row: SignoutTablesState, updateCrew?: UpdateCrewType, isFormer: boolean }) => {
    const filteredCrew = React.useMemo(() => (props.row.$$crew || []).filter((a) => props.isFormer ? option.isSome(a.endActive) : option.isNone(a.endActive)), [props.row.$$crew]);
    if (filteredCrew.length === 0) {
        return <p>None</p>;
    }
    return <Table size="sm">
        <thead>
            <tr>
                {props.updateCrew != undefined ? <th style={crewTableHeaderStyle}>{props.isFormer ? "Add" : "Remove"}</th> : <></>}
                <th style={crewTableHeaderStyle}>Card #</th>
                <th style={crewTableHeaderStyle}>First</th>
                <th style={crewTableHeaderStyle}>Last</th>
            </tr>
        </thead>
        <tbody>
            {(filteredCrew).map((a) => <CrewRow key={a.crewId} crew={a} updateCrew={props.updateCrew} isFormer={props.isFormer}/>)}
        </tbody>
    </Table>
};

export const CrewRow = (props: {crew: SignoutCrewState, updateCrew: UpdateCrewType, isFormer?: boolean}) => {
    return <tr>
        {props.updateCrew !== undefined ? <td><a onClick={(e) => props.updateCrew(optionifyProps(props.crew), props.isFormer)}>{props.isFormer ? <Plus color="#777" size="1.4em" /> : <X color="#777" size="1.4em" />}</a></td> : <></>}
        <td>{props.crew.cardNum.getOrElse("None")}</td>
        <td>{props.crew.$$person.nameFirst}</td>
        <td>{props.crew.$$person.nameLast}</td>
    </tr>
}

const PERSON_GET_STATE_INITIAL = 0;
const PERSON_GET_STATE_NOT_FOUND = 1;
const PERSON_GET_STATE_WAITING = 2;
const PERSON_GET_STATE_SUCCESSFUL = 4;

const AddCrew = (props: { row: SignoutTablesState, updateCrew: UpdateCrewType, setErrors: (value: React.SetStateAction<string[]>) => void, boatTypes: BoatTypesValidatorState }) => {
    const [cardNum, setCardNum] = React.useState(option.none as Option<string>);
    const [personGetState, setPersonGetState] = React.useState({state: PERSON_GET_STATE_INITIAL, person: undefined});
    const throttler: ThrottledUpdater = React.useMemo(() => new ThrottledUpdater(200, () => { }), []);
    const asc = React.useContext(AppStateContext);
    React.useEffect(() => {
        throttler.handleUpdate = () => {
            if (cardNum.isNone()) {
                setPersonGetState({state: PERSON_GET_STATE_NOT_FOUND, person: undefined});
                return;
            }
            getPersonByCardNumber.sendWithParams(asc, option.none, { cardNumber: Number(cardNum.getOrElse("")) })(null).then((a) => {
                if (a.type === "Success") {
                    setPersonGetState({state: PERSON_GET_STATE_SUCCESSFUL, person: a.success});
                } else {
                    setPersonGetState({state: PERSON_GET_STATE_NOT_FOUND, person: undefined});
                }
            });
        };
        throttler.startUpdate();
    }, [cardNum]);
    if (props.row.signoutId === undefined) {
        return <></>;
    }

    const person = personGetState.person;

    const state = personGetState.state;

    return <>
        <ValidatedTextInput type={"text"} initValue={cardNum} updateValue={(val) => {setCardNum(val); setPersonGetState((s) => ({...s, state: PERSON_GET_STATE_WAITING}))}} validationResults={[]} placeholder={"Card #"} />
        {state === PERSON_GET_STATE_SUCCESSFUL ? <><Table><tbody><CrewRow crew={{ $$person: person, cardNum: cardNum, crewId: -1, personId: option.some(person.personId), signoutId: undefined, startActive: undefined, endActive: undefined }} updateCrew={undefined} /></tbody></Table>
        <Button spinnerOnClick onClick={(e) => {
            e.preventDefault();
            console.log("doing");
            if (props.row.$$skipper.personId == person.personId) {
                props.setErrors(["Cannot add skipper as crew"]);
                return Promise.resolve();
            }
            if (props.row.$$crew.find((a) => a.personId.getOrElse(-1) == person.personId && option.isNone(a.endActive)) != undefined) {
                props.setErrors(["Person is already a crew member"]);
                return Promise.resolve();
            }
            return props.updateCrew({cardNum: cardNum, $$person: option.some(person), startActive: option.none, endActive: option.none, crewId: option.none, signoutId: option.some(props.row.signoutId), personId: option.some(person.personId) }, true);
        }}>Add</Button></> : <h1>{state === PERSON_GET_STATE_WAITING ? "Loading" : "Not Found"}</h1>}
    </>
}

export const CrewHover = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
    return <MultiHover makeChildren={() => { return props.row.$$crew.length > 0 ? <><h3>Current</h3><CrewTable row={props.row} isFormer={false} /><h3>Former</h3><CrewTable row={props.row} isFormer={true} /></> : undefined }} handleClick={() => props.extraState.setUpdateCrewModal(props.row.signoutId)} openDisplay={props.row.$$crew.length > 0 ? "Crew" : "-"} noMemoChildren={true} />
}