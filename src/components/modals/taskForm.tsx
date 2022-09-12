import React, { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
	appModalState,
	closeModalAsync,
} from "../../store/slices/app-modal/app-modal.slice";
import { RootState } from "../../store/store";
import Task from "../task/form";
import { Modal, Body, Header } from "./modal";

function TaskForm(props: appModalState) {
	const { contents } = props;
	const dispatch = useAppDispatch();
	const taskForm = useAppSelector((state: RootState) => state.task.form);
	const appModal = useAppSelector((state: RootState) => state.appModal);

	const _handleClose = () => {
		dispatch(closeModalAsync());
	};

	useEffect(() => {
		if (appModal.isVisible && _.isEmpty(taskForm.form)) {
			// console.log("TaskForm => ", taskForm);
		}
	}, []);

	return (
		<Modal>
			<Header>
				<div className="flex justify-between">
					<div>
						<h4 className="text-[18px]">
							{taskForm.form.uuid ? "Edit task" : "Create task"}
						</h4>
					</div>
					<div>
						<AiOutlineCloseCircle
							className="transition duration-150 text-[26px] cursor-pointer hover:text-[#f87171]"
							onClick={_handleClose}
						/>
					</div>
				</div>
			</Header>
			<Body>
				<Task handleClose={_handleClose} />
			</Body>
		</Modal>
	);
}

export default TaskForm;
