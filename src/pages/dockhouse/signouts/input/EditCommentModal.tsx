import * as React from "react";
import { ValidatedTextInput } from "components/wrapped/Input";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import { EditModal, EditModalCommonProps } from "./EditModal";
import Button from "components/wrapped/Button";

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
                <Button spinnerOnClick onClick={() => props.updateComments(comments, props.currentRow.signoutId, setErrors)} >
                    Save
                </Button>
            }>
            <ValidatedTextInput type={"textarea"} controlledValue={commentsPadded} updateValue={setComments} validationResults={[]} />
        </EditModal>
    </>
};