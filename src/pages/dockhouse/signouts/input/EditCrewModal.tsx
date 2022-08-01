import { ButtonWrapper } from "components/ButtonWrapper";
import { Row, Table } from "reactstrap";

import * as React from "react";
import { BoatTypesValidatorState, isCrewValid, SignoutsTablesExtraState, SignoutTablesState } from "../SignoutsTablesPage";
import { ValidatedTextInput } from "./ValidatedInput";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import * as t from "io-ts";
import { crewPersonValidator, getPersonByCardNumber, putSignoutCrew, signoutCrewValidator } from "async/rest/signouts-tables";
import { X } from "react-feather";
import { MultiHover } from "../MultiHover";
import { EditModal, EditModalCommonProps } from "./EditModal";
import * as moment from "moment";
import { DefaultDateTimeFormat, Modified } from "util/OptionalTypeValidators";

type SignoutCrewState = t.TypeOf<typeof signoutCrewValidator>;
//type SignoutCrewStateOptionalPK = Optionify<SignoutCrewState, {crewId: Option<number> | number}>;

type UpdateCrewType = (crew: SignoutCrewState, active: boolean) => Promise<any>;

export const EditCrewModal = (props: EditModalCommonProps & { updateCurrentRow: (row: SignoutTablesState) => void, boatTypes: BoatTypesValidatorState }) => {
    const [errors, setErrors] = React.useState([] as string[]);
    const updateCrew: UpdateCrewType = (crewMember, active) => {
        console.log("update crew called" + active);

        var foundCrew: SignoutCrewState = null;
        
        const newCrew = props.currentRow.$$crew.map((a) => {
            if(a.crewId == crewMember.crewId || a.cardNum == crewMember.cardNum){
                foundCrew = a;
                return {...a};
            }else{
                return a;
            }
        });

        if(foundCrew === null){
            newCrew.push(crewMember);
            foundCrew = crewMember;
        }
        foundCrew.endActive = option.none;
        foundCrew.startActive = foundCrew.startActive = option.some(moment(foundCrew.startActive.getOrElse("")).format(DefaultDateTimeFormat));
        //const foundCrew: SignoutCrewState = Object.assign({startActive: option.none}, props.currentRow.$$crew.find((a) => a.crewId == crew.crewId ||));
        //foundCrew.startActive = option.some(moment(foundCrew.startActive.getOrElse("")).format(DefaultDateTimeFormat));
        //foundCrew.endActive = !active ? option.some(moment().format(DefaultDateTimeFormat)) : option.none;
        //foundCrew.signoutId = props.currentRow.signoutId;
        const crewBoatErrors = isCrewValid(newCrew, props.currentRow.boatId, props.boatTypes);
        if (crewBoatErrors !== undefined) {
            setErrors(crewBoatErrors);
            console.log("boatError");
            return Promise.resolve();
        }
        console.log("almost done");
        console.log(foundCrew);
        return putSignoutCrew.sendJson(foundCrew).then((a) => {
            if (a.type === "Success") {
                //TODO fix this eventually to use response value instead of post value
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
                <CrewTable row={props.currentRow} isFormer={true} />
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
    constructor(timeout: number, handleUpdate: () => void) {
        this.timerID = undefined;
        this.timeout = timeout;
        this.handleUpdate = handleUpdate;
        this.startUpdate = this.startUpdate.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    startUpdate() {
        this.cancel();
        this.timerID = setTimeout(function () {
            this.handleUpdate();
            this.timerID = undefined;
        }.bind(this), this.timeout);
    }
    cancel() {
        if (this.timerID != undefined) {
            clearTimeout(this.timerID);
        }
    }

}

export const CrewTable = (props: { row: SignoutTablesState, updateCrew?: UpdateCrewType, isFormer: boolean }) => {
    const filteredCrew = React.useMemo(() => (props.row.$$crew || []).filter((a) => props.isFormer ? option.isSome(a.endActive) : option.isNone(a.endActive)), [props.row.$$crew]);
    if (filteredCrew.length === 0) {
        return <p>None</p>;
    }
    return <Table size="sm">
        <thead>
            <tr>
                {props.updateCrew != undefined ? <td>Remove</td> : <></>}
                <td>Card #</td>
                <td>First</td>
                <td>Last</td>
            </tr>
        </thead>
        <tbody>
            {(filteredCrew).map((a) => <CrewRow crew={a} updateCrew={props.updateCrew} />)}
        </tbody>
    </Table>
};

export const CrewRow = (props: {crew: SignoutCrewState, updateCrew: UpdateCrewType}) => {
    return <tr key={props.crew.crewId}>
        {props.updateCrew !== undefined ? <td><a onClick={(e) => props.updateCrew(props.crew, false)}><X color="#777" size="1.4em" /></a></td> : <></>}
        <td>{props.crew.cardNum.getOrElse("None")}</td>
        <td>{props.crew.$$person.nameFirst}</td>
        <td>{props.crew.$$person.nameLast}</td>
    </tr>
}

const AddCrew = (props: { row: SignoutTablesState, updateCrew: UpdateCrewType, setErrors: (value: React.SetStateAction<string[]>) => void, boatTypes: BoatTypesValidatorState }) => {
    const [cardNum, setCardNum] = React.useState(option.none as Option<string>);
    const [person, setPerson] = React.useState(undefined as t.TypeOf<typeof crewPersonValidator>);
    const throttler: ThrottledUpdater = React.useMemo(() => new ThrottledUpdater(200, () => { }), []);
    React.useEffect(() => {
        throttler.handleUpdate = () => {
            if (cardNum.isNone()) {
                return;
            }
            getPersonByCardNumber.sendWithParams(option.none, { cardNumber: Number(cardNum.getOrElse("")) })(null).then((a) => {
                if (a.type === "Success") {
                    setPerson(a.success);
                    console.log(a.success);
                } else {
                    setPerson(undefined);
                }
            });
        };
        throttler.startUpdate();
    }, [cardNum]);
    if (props.row.signoutId === undefined) {
        return <></>;
    }
    return <>
        <ValidatedTextInput type={"text"} initValue={cardNum} updateValue={(val) => setCardNum(val)} validationResults={[]} placeholder={"Card #"} />
        {person !== undefined ? <Table><tbody><CrewRow crew={{ $$person: person, cardNum: cardNum, crewId: -1, personId: option.some(person.personId), signoutId: undefined, startActive: undefined, endActive: undefined }} updateCrew={props.updateCrew} /></tbody></Table> : "Not found"}
        {person !== undefined ? <ButtonWrapper spinnerOnClick onClick={(e) => {
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
            return undefined;//props.updateCrew({cardNum: cardNum, $$person: person, startActive: null, endActive: null, crewId: -1, signoutId: props.row.signoutId, }, true);
        }}>Add</ButtonWrapper> : ""}
    </>
}

export const CrewHover = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
    return <MultiHover makeChildren={() => { return props.row.$$crew.length > 0 ? <><h3>Current</h3><CrewTable row={props.row} isFormer={false} /><h3>Former</h3><CrewTable row={props.row} isFormer={true} /></> : undefined }} handleClick={() => props.extraState.setUpdateCrewModal(props.row.signoutId)} openDisplay={props.row.$$crew.length > 0 ? "Crew" : "-"} noMemoChildren={true} />
}