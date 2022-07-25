import { ButtonWrapper } from "components/ButtonWrapper";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from "reactstrap";

import * as React from "react";
import { BoatTypesValidatorState, isCrewValid, SignoutTablesState } from "../SignoutsTablesPage";
import { ValidatedTextInput } from "./ValidatedInput";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import * as t from "io-ts";
import { crewPersonValidator, getPersonByCardNumber, putSignoutCrew, signoutCrewValidator } from "async/rest/signouts-tables";
import { X } from "react-feather";
import { MultiHover } from "../MultiHover";
import { EditModal, EditModalCommonProps } from "./EditModal";
import { momentNowDefaultDateTime } from "util/OptionalTypeValidators";

export const EditCrewModal = (props: EditModalCommonProps & { updateCurrentRow: (row: SignoutTablesState) => void, boatTypes: BoatTypesValidatorState }) => {
    const [errors, setErrors] = React.useState([] as string[]);
    return <>
        <EditModal {...props} errors={errors} setErrors={setErrors} headerChildren={
            "Edit Crew"
        }>
            {props.currentRow !== undefined ? <>
                <h1>Active Crew</h1>
                <CrewTable row={props.currentRow} isFormer={false} removeCrew={(crewId: number) => {
                    const foundCrew = Object.assign({}, props.currentRow.$$crew.find((a) => a.crewId.getOrElse(-1) == crewId));
                    foundCrew.endActive = option.some(momentNowDefaultDateTime().format());
                    const newCrew = props.currentRow.$$crew.map((a) => {
                        if (a.crewId.getOrElse(-1) == crewId) {
                            return foundCrew;
                        } else {
                            return a;
                        }
                    });
                    const crewBoatErrors = isCrewValid(newCrew, props.currentRow.boatId, props.boatTypes);
                    if(crewBoatErrors !== undefined){
                        setErrors(crewBoatErrors);
                        return;
                    }
                    putSignoutCrew.sendJson(foundCrew).then((a) => {
                        if (a.type === "Success") {
                            //TODO fix this eventually to use response value instead of post value
                            props.updateCurrentRow({
                                ...props.currentRow, $$crew: newCrew
                            });
                        } else {
                            setErrors(["Server error deleting crew"]);
                        }
                    })
                }} />
                <h1>Past Crew</h1>
            <CrewTable row={props.currentRow} isFormer={true} />
            <h1>Add Crew</h1>
            <AddCrew row={props.currentRow} updateCurrentRow={props.updateCurrentRow} setErrors={setErrors} boatTypes={props.boatTypes} />
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


export const CrewTable = (props: { row: SignoutTablesState, removeCrew?: (crewId: number) => void, isFormer: boolean }) => {
    const filteredCrew = React.useMemo(() => (props.row.$$crew || []).filter((a) => props.isFormer ? option.isSome(a.endActive) : option.isNone(a.endActive)), [props.row.$$crew]);
    return <Table size="sm">
        <thead>
            <tr>
                {props.removeCrew != undefined ? <td>Remove</td> : <></>}
                <td>Card #</td>
                <td>First</td>
                <td>Last</td>
            </tr>
        </thead>
        <tbody>
            {(filteredCrew).map((a) => <CrewRow crew={a} removeCrew={props.removeCrew} />)}
        </tbody>
    </Table>
};

export const CrewRow = (props: { crew: t.TypeOf<typeof signoutCrewValidator>, removeCrew?: (crewId: number) => void }) => {
    return <tr key={props.crew.crewId.getOrElse(-1)}>
        {props.removeCrew !== undefined ? <td><a onClick={() => props.removeCrew(props.crew.crewId.getOrElse(-1))}><X color="#777" size="1.4em" /></a></td> : <></>}
        <td>{props.crew.cardNum.getOrElse("None")}</td>
        <td>{props.crew.$$person.nameFirst}</td>
        <td>{props.crew.$$person.nameLast}</td>
    </tr>
}

const AddCrew = (props: { row: SignoutTablesState, updateCurrentRow: (row: SignoutTablesState) => void, setErrors: (value: React.SetStateAction<string[]>) => void, boatTypes: BoatTypesValidatorState }) => {
    const [cardNum, setCardNum] = React.useState(option.none as Option<string>);
    const [person, setPerson] = React.useState(undefined as t.TypeOf<typeof crewPersonValidator>);
    const throttler: ThrottledUpdater = React.useMemo(() => new ThrottledUpdater(200, () => { }), []);
    React.useEffect(() => {
        throttler.handleUpdate = () => {
            if(cardNum.isNone()){
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
        {person !== undefined ? <Table><tbody><CrewRow crew={{ $$person: person, cardNum: cardNum, crewId: option.some(-1), personId: option.some(person.personId), signoutId: undefined, startActive: undefined, endActive: undefined }} /></tbody></Table> : "Not found"}
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
            const newSignoutCrew: t.TypeOf<typeof signoutCrewValidator> = Object.assign({}, props.row.$$crew.find((a) => a.personId.getOrElse(-1) == person.personId) || {} as any);
            const isBlank = newSignoutCrew.signoutId === undefined;
            Object.assign(newSignoutCrew, {
                startActive: option.some(momentNowDefaultDateTime()),
                $$person: person,
                endActive: option.none,
                signoutId: props.row.signoutId,
                cardNum: cardNum,
                personId: option.some(person.personId)});
            const newCrew = props.row.$$crew.map((a) => {
                if(a.personId.getOrElse(-1) == person.personId){
                    return Object.assign({}, newSignoutCrew);
                }else{
                    return a;
                }
            });
            if(isBlank){
                newCrew.push(newSignoutCrew);
            }
            const crewBoatErrors = isCrewValid(newCrew, props.row.boatId, props.boatTypes);
            if(crewBoatErrors !== undefined){
                props.setErrors(crewBoatErrors);
                return Promise.resolve();
            }else{
                return putSignoutCrew.sendJson(newSignoutCrew).then((a) => {
                    console.log("response");
                    if (a.type === "Success") {
                        //TODO this is a little bit bad, probably should just be sending all the fields of the object in the api call
                        const success = a.success;
                        delete success["$$person"];
                        Object.assign(newSignoutCrew, a.success);
                        props.setErrors([]);
                        console.log(newCrew);
                        props.updateCurrentRow({ ...props.row, $$crew: newCrew });
                    } else {
                        console.log("Error", a);
                        props.setErrors(["Server error adding crew"]);
                    }
                });
            }
        }}>Add</ButtonWrapper> : ""}
    </>
}

export const CrewHover = (props: { row: SignoutTablesState}) => {
    return <MultiHover makeChildren={() => { return props.row.$$crew.length > 0 ? <><p>Current</p><CrewTable row={props.row} isFormer={false} /><p>Former</p><CrewTable row={props.row} isFormer={true} /></> : undefined }} handleClick={() => props.row.extraState.setUpdateCrewModal(props.row.signoutId)} openDisplay={props.row.$$crew.length > 0 ? "Crew" : "-"} noMemoChildren={true} />
}