import { ButtonWrapper } from "components/ButtonWrapper";

import * as React from "react";
import { ValidatedTextInput } from "./ValidatedInput";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import { EditModal, EditModalCommonProps } from "./EditModal";

export type SetErrorsType = (errors: React.SetStateAction<string[]>) => void;

export const EditCommentsModal = (props: EditModalCommonProps & {updateComments: (comments: Option<string>, signoutId: number, setErrors: SetErrorsType) => Promise<any>}) => {
    const [comments, setComments] = React.useState((props.currentRow || {}).comments);
    const [errors, setErrors] = React.useState([] as string[]);
    React.useEffect(() => {
        setComments((props.currentRow || {}).comments);
    }, [props.currentRow]);
    const commentsPadded = comments === undefined ? option.none : comments;
    return <>
        <EditModal {...props} errors={errors} setErrors={setErrors} headerChildren={
            "Edit Comments"
        }
            footerChildren={
                <ButtonWrapper spinnerOnClick onClick={() => props.updateComments(comments, props.currentRow.signoutId, setErrors)} >
                    Save
                </ButtonWrapper>
            }>
            <ValidatedTextInput type={"textarea"} initValue={commentsPadded} updateValue={setComments} validationResults={[]} />
        </EditModal>
    </>
};