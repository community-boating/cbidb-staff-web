import { ButtonWrapper } from "components/ButtonWrapper";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import * as React from "react";
import { SignoutTablesState } from "../SignoutsTablesPage";
import { ValidatedTextInput } from "./ValidatedInput";
import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import { ErrorPopup } from "components/ErrorPopup";

export type EditModalCommonProps = {modalIsOpen: boolean, closeModal: () => void, currentRow: SignoutTablesState};

export const EditModal: (props: EditModalCommonProps & {children: React.ReactNode, footerChildren?: React.ReactNode, headerChildren: React.ReactNode, errors: string[]}) => JSX.Element = (props) => {
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
                <ErrorPopup errors={props.errors}/>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" outline onClick={() => props.closeModal()}>
                    Cancel
                </Button>{" "}
                {props.footerChildren === undefined ? <></> : props.footerChildren}
            </ModalFooter>
        </Modal>
        </>);
}