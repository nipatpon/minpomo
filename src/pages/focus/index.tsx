import _ from "lodash";
import PomoCore from "../../components/pomo-core";
import FocusNavbar from "../../components/navbars/focusNavbar";
import FullSizeLayout from "../../layouts/full-size";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { RootState } from "../../store/store";
import { TaskForm } from "../../store/slices/task/type";
import { updateTaskAsync } from "../../store/slices/task/form.slice";
import React, { useEffect, useState } from "react";

function FocusTask() {
	const dispatch = useAppDispatch();
	const taskForm: TaskForm = useAppSelector(
		(state: RootState) => state.task.form
	);

	const [isFocus, setIsFocus] = useState(false);

	const _receivePomoResult = async (result: any) => {
		try {
			Object.freeze(taskForm.form);
			const updateTask = { ...taskForm.form };
			updateTask["round"] = result.pomoCount;
			if (updateTask.status === "new") updateTask.status = "inprogress";
			if (result.pomoCount >= 4) updateTask.status = "success";
			await dispatch(updateTaskAsync(updateTask)).unwrap();
		} catch (error) {
			console.log("Count pomo update Error => ", error);
		}
	};

	return (
		<div className={`relative mx-auto h-full bg-white overflow-y-hidden`}>
			<div className="w-[100%]">
				<FocusNavbar
					title={taskForm.form.title || ""}
					selectTask={taskForm.form}
					isFocus={isFocus}
				/>
			</div>
			<div
				className={`pt-[100px] pb-[20px] p-[5px] h-[calc(100vh_-_0px)] overflow-y-auto scroll-bar-none`}
			>
				<PomoCore
					taskForm={taskForm.form}
					isFocus={setIsFocus}
					callback={_receivePomoResult}
				/>
			</div>
		</div>
	);
}

FocusTask.layout = FullSizeLayout;
export default FocusTask;
