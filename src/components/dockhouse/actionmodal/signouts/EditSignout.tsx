import * as React from 'react';
import { option } from 'fp-ts';
import { SignoutCombinedType } from './SignoutCombinedType';
import BoatIcon, { BoatSelect } from '../BoatIcon';
import { DetailedPersonInfo, AddEditCrew, getCrewActions } from '../SkipperInfo';
import SignoutNumbersDropdown from './SignoutNumbersDropdown';
import { ActionActionType } from 'components/ActionBasedEditor';
import { UpdatePersonByIdAction, UpdateSignoutAction } from '../member-action/Actions';
import { MemberActionMode } from '../member-action/MemberActionType';
import { signoutNumberKeys, DialogOutput, setBoatIdAction } from './EditSignoutModal';
import { UpdateCrewAction } from '../class/Actions';


export function EditSignout(props: { current: SignoutCombinedType; actions: ActionActionType<SignoutCombinedType>; mode: MemberActionMode; dialogOutput: option.Option<string>; }) {
    const crewActions = getCrewActions(props);
    const numbersSorted = React.useMemo(() => Object.entries(props.current).filter((a) => signoutNumberKeys.contains(a[0] as any)).sort((a, b) => (signoutNumberKeys.indexOf(a[0] as any) - signoutNumberKeys.indexOf(b[0] as any))).map((a) => a[1] as option.Option<number | string>), [props.current]);
    return (
        <div className="flex flex-col grow-[1] gap-5">
            <div className="flex flex-row grow-[0] gap-5">
                {props.current.currentPeople.map((a) => (<DetailedPersonInfo key={a.personId} currentPerson={a} mode={props.mode} setTesting={(b) => {
                    crewActions.setTesting(a.personId, b);
                }} setTestRatingId={(v) => {
                    props.actions.addAction(new UpdatePersonByIdAction(a.personId, {testRatingId: v}))
                }}/>))}
                <AddEditCrew currentPeople={props.current.currentPeople} {...crewActions} mode={props.mode} />
            </div>
            <div className="flex flex-row grow-[1]">
                <DialogOutput>
                    <p>{props.dialogOutput.isSome() ? props.dialogOutput.value : <></>}</p>
                </DialogOutput>
            </div>
            <div className="flex flex-row grow-[3]">
                <div className="w-full flex flex-col">
                    <p>Boat Type</p>
                    <BoatIcon boatId={props.current.boatId} setBoatId={setBoatIdAction(props.actions)} />
                    <div className="flex flex-row gap-5 py-5">
                        <div className="flex flex-col items-end gap-5">
                            <BoatSelect tabIndex={-1} boatId={props.current.boatId} setBoatId={setBoatIdAction(props.actions)} autoWidth nowrap></BoatSelect>
                        </div>
                        <div className="flex flex-col items-end gap-5">
                            <SignoutNumbersDropdown numbers={numbersSorted} setNumber={(i, v) => {
                                props.actions.addAction(new UpdateSignoutAction(signoutNumberKeys[i], v as any));
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
