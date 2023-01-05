import * as React from "react";
import { ErrorPopupControlled } from "components/ErrorPopup";
import { SetErrorsType } from "./EditCommentModal";
import Modal, { ModalHeader } from "components/wrapped/Modal";
import Button from "components/wrapped/Button";
import { SignoutTablesState } from "../StateTypes";

export type EditModalCommonProps = {modalIsOpen: boolean, closeModal: () => void, currentRow: SignoutTablesState};

export const EditModal: (props: EditModalCommonProps & {children: React.ReactNode, footerChildren?: React.ReactNode, headerChildren: React.ReactNode, errors: string[], setErrors: SetErrorsType}) => JSX.Element = (props) => {
   const closeModal = () => {props.closeModal(); props.setErrors([])};
   return (<>
        <Modal
            open={props.modalIsOpen}
            setOpen={() => closeModal()}
            className="w-[75vw]"
            >
            <ModalHeader>{props.headerChildren}</ModalHeader>
            <div className="text-center m-3">
                <ErrorPopupControlled errors={props.errors} setErrors={props.setErrors}/>
                {props.children}
            </div>
            <div>
                <Button color="secondary" onClick={(e) => {e.preventDefault(); closeModal()}}>
                    Back
                </Button>{" "}
                {props.footerChildren === undefined ? <></> : props.footerChildren}
            </div>
        </Modal>
        </>);
}