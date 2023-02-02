import * as React from 'react';
import { option } from 'fp-ts';
import { OptionalStringInput } from 'components/wrapped/Input';
import { ScannedCrewType, ScannedPersonType } from 'async/staff/dockhouse/scan-card';
import { ScannedPersonsCacheContext } from './ScannedPersonsCache';
import { RatingsHover } from 'pages/dockhouse/signouts/RatingSorter';

export function findCurrentMembership(person: ScannedPersonType){
    return person.activeMemberships[0];
}

export function CardNumberScanner(props: ({ label: string; onAction: (result: ScannedCrewType[number]) => void; externalQueueTrigger?: number, className?: string})) {
    const [cardNum, setCardNum] = React.useState<option.Option<string>>(option.none);
    const [foundPerson, setFoundPerson] = React.useState<option.Option<ScannedCrewType[number]>>(option.none);
    const [error, setError] = React.useState<option.Option<string>>(option.none);
    const [actionQueued, setActionQueued] = React.useState<option.Option<string>>(option.none);
    const timeoutID = React.useRef<NodeJS.Timeout>(undefined);
    const context = React.useContext(ScannedPersonsCacheContext);
    const findCardNum = (cardNum: string) => {
        if (timeoutID.current) {
            clearTimeout(timeoutID.current);
        }
        timeoutID.current = setTimeout(() => {
            context.getCached(cardNum, (result) => {
                if (result.isSome()) {
                    setFoundPerson(option.some(result.value));
                    setError(option.none);
                } else {
                    setFoundPerson(option.none);
                    setError(option.some("Couldn't find person"));
                }
                timeoutID.current = undefined;
            });
        }, 200);
    };
    const addCardNumToCrew = () => {
        if (foundPerson.isSome() && actionQueued.isSome() && actionQueued.value == foundPerson.value.cardNumber) {
            props.onAction(foundPerson.value);
            setActionQueued(option.none);
        }
    };
    React.useEffect(() => {
        if (cardNum.isSome())
            findCardNum(cardNum.value);
    }, [cardNum]);
    React.useEffect(() => {
        addCardNumToCrew();
    }, [foundPerson, actionQueued]);
    const doQueue = () => {
        setActionQueued(cardNum);
    };
    React.useEffect(() => {
        (props.externalQueueTrigger > 0) && doQueue();
    }, [props.externalQueueTrigger]);
    return <div className={props.className || ""}>
        {foundPerson.isSome() ? <RatingsHover person={foundPerson.value} programId={findCurrentMembership(foundPerson.value).programId.getOrElse(undefined)} orphanedRatingsShownByDefault={{}} label={foundPerson.value.nameFirst + " " + foundPerson.value.nameLast}></RatingsHover> : ""} 
        {error.isSome() ? error.value : ""}
        <OptionalStringInput label={props.label} controlledValue={cardNum} updateValue={(value) => { setCardNum(value); }} onEnter={() => {
            doQueue();
        }}></OptionalStringInput>
    </div>;
}
