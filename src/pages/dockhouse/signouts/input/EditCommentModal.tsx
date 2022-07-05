import { ButtonWrapper } from "components/ButtonWrapper";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import * as React from "react";
import { SignoutTablesState } from "../SignoutsTablesPage";
import { ValidatedTextInput } from "./ValidatedInput";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";

export const EditCommentsModal = (props: {modalIsOpen: boolean, setModalIsOpen: (modalOpen: boolean) => void, currentRow: SignoutTablesState, updateComments: (comments: Option<string>, signoutId: number) => Promise<any>}) => {
    const [comments, setComments] = React.useState((props.currentRow || {}).comments);
    React.useEffect(() => {
            setComments((props.currentRow || {}).comments);
    }, [props.currentRow]);
    const commentsPadded = comments === undefined ? option.none : comments;
return <>
<Modal
    isOpen={props.modalIsOpen}
    toggle={() => props.setModalIsOpen(false)}
    centered
    >
    <ModalHeader toggle={() => props.setModalIsOpen(false)}>
        Edit Comments
    </ModalHeader>
    <ModalBody className="text-center m-3">
        <ValidatedTextInput type={"textarea"} initValue={commentsPadded} updateValue={setComments} validationResults={[]}/>
    </ModalBody>
    <ModalFooter>
        <Button color="secondary" outline onClick={() => props.setModalIsOpen(false)}>
            Cancel
        </Button>{" "}
        <ButtonWrapper spinnerOnClick onClick={() => props.updateComments(comments, props.currentRow.signoutId)} >
            Save
        </ButtonWrapper>
    </ModalFooter>
</Modal>
</>
};