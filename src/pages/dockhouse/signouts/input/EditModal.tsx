import { ButtonWrapper } from "components/ButtonWrapper";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import * as React from "react";
import { SignoutTablesState } from "../SignoutsTablesPage";
import { ErrorPopup, ErrorPopupControlled } from "components/ErrorPopup";
import { SetErrorsType } from "./EditCommentModal";

export type EditModalCommonProps = {modalIsOpen: boolean, closeModal: () => void, currentRow: SignoutTablesState};

export const EditModal: (props: EditModalCommonProps & {children: React.ReactNode, footerChildren?: React.ReactNode, headerChildren: React.ReactNode, errors: string[], setErrors: SetErrorsType}) => JSX.Element = (props) => {
    return (<>
        <Modal
            isOpen={props.modalIsOpen}
            toggle={() => props.closeModal()}
            centered
            >
            <ModalHeader toggle={() => props.closeModal()}>
                {props.headerChildren}
            </ModalHeader>
            <ModalBody className="text-center m-3">
                <ErrorPopupControlled errors={props.errors} setErrors={props.setErrors}/>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" outline onClick={() => props.closeModal()}>
                    Back
                </Button>{" "}
                {props.footerChildren === undefined ? <></> : props.footerChildren}
            </ModalFooter>
        </Modal>
        </>);
}