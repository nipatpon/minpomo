import React from "react";
import { useAppDispatch } from "../../store/hook";
import {
    appModalState,
    openModalAsync,
} from "../../store/slices/app-modal/app-modal.slice";
import { Modal, Body, Header, Footer } from "./modal";
import { FcHighPriority } from "react-icons/fc";

function Confirm(props: appModalState) { 

    const { contents, handleCancel = () => { }, handleConfirm = () => { } } = props;

    const dispatch = useAppDispatch();

    const _handleClose = () => {
        dispatch(openModalAsync({ isVisible: false }));
    };

    return (
        <Modal>
            <Body>
                <div className="flex justify-center pb-2">
                    <FcHighPriority className="text-[64px]"/>
                </div>
                {contents}
            </Body>
            <Footer>
                <div className={`flex justify-between`}>
                    <button
                        type="button"
                        className="w-[80px] border p-2 hover:bg-zinc-100 hover:text-zinc-700 "
                        onClick={() => {
                            handleCancel();
                            _handleClose();
                        }}
                    >
                        {" "}
                        Cancel{" "}
                    </button>
                    <button
                        type="button"
                        className="w-[80px] border p-2 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => {
                            handleConfirm();
                            _handleClose();
                        }}
                    >
                        {" "}
                        Yes{" "}
                    </button>
                </div>
            </Footer>
        </Modal>
    );
}

export default Confirm;
