import { ButtonWrapper } from "components/ButtonWrapper";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import * as React from "react";
import { SignoutTablesState } from "../SignoutsTablesPage";
import { ValidatedTextInput } from "./ValidatedInput";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import { EditModal, EditModalCommonProps } from "./EditModal";

export const EditCommentsModal = (props: EditModalCommonProps & {updateComments: (comments: Option<string>, signoutId: number, setErrors: (errors: React.SetStateAction<string[]>) => void) => Promise<any>}) => {
    const [comments, setComments] = React.useState((props.currentRow || {}).comments);
    const [errors, setErrors] = React.useState([] as string[]);
    React.useEffect(() => {
        setComments((props.currentRow || {}).comments);
    }, [props.currentRow]);
    const commentsPadded = comments === undefined ? option.none : comments;
    return <>
        <EditModal {...props} errors={errors} headerChildren={
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