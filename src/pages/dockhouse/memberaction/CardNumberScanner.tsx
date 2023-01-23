import * as React from 'react';
import { option } from 'fp-ts';
import { OptionalStringInput } from 'components/wrapped/Input';
import { GoButton } from 'components/wrapped/IconButton';
import { ScannedCrewType } from 'async/staff/dockhouse/scan-card';
import { ScannedPersonsCacheContext } from './ScannedPersonsCache';


export function CardNumberScanner(props: ({ label: string; onAction: (result: ScannedCrewType[number]) => void; })) {
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
    return <div className="">
        <OptionalStringInput label={props.label} controlledValue={cardNum} end={<GoButton onClick={() => { doQueue(); }} />} updateValue={(value) => { setCardNum(value); }} onEnter={() => {
            doQueue();
        }}></OptionalStringInput>
        {foundPerson.isSome() ? (foundPerson.value.nameFirst + " " + foundPerson.value.nameLast) : ""}
        {error.isSome() ? error.value : ""}
    </div>;
}
