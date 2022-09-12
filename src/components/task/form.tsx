import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import utc from "dayjs/plugin/utc";
import { default as dayjs } from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Image from 'next/image';

import CustomDatePicker from "../utils/datePicker";
import CustomTimePicker from "../utils/timePicker";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import { TaskForm, TTaskForm } from "../../store/slices/task/type";
import { RootState } from "../../store/store";

import {
	createTaskAsync,
	updateTaskAsync,
} from "../../store/slices/task/form.slice";

import CmpIcons from '../icons'

dayjs.extend(utc);
dayjs.utc(); 

interface ITask {
	modalTitle?: string;
	taskForm?: TaskForm;
	handleClose?: Function;
	border?: boolean;
}

type TaskSubmitForm = {
	title: string;
	date: string;
	start_time: string;
	pomoDuration: string;
	shortBreakDuration: string;
	longBreakDuration: string;
};

function TaskForm(props: ITask) {
	const dispatch = useAppDispatch();

	const selectContainer = useRef<HTMLDivElement>(null);

	const taskForm: TaskForm = useAppSelector(
		(state: RootState) => state.task.form
	);

	const { handleClose = () => {} } = props;
	const validationTaskSchema = Yup.object().shape({
		title: Yup.string().required("Task title is required."),
		pomoDuration: Yup.string().required("Pomodoro is required."),
		shortBreakDuration: Yup.string().required("ShortBreak is required."),
		longBreakDuration: Yup.string().required("LongBreak is required."),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TaskSubmitForm>({
		resolver: yupResolver(validationTaskSchema),
	});

	const [date, setDate] = useState(taskForm.form.date);
	const [time, setTime] = useState(taskForm.form.startTime);
	const [openSelect, setOpenSelect] = useState(false);
	const [category, setCategory] = useState<
		"generals" | "think" | "health" | "music" | "comunicate"
	>("generals");

	useEffect(() => {
		document.addEventListener("mousedown", function (event) {
			const target = event.target as HTMLElement;
			if (
				selectContainer.current &&
				!selectContainer.current.contains(target)
			) {
				setOpenSelect(false);
			}
		});
	}, []);

	const _handleSetTime = (time: string) => {
		setTime(time);
	};

	const onSubmit = async (data: TaskSubmitForm) => {
		let form: TTaskForm = {
			...taskForm.form,
			title: data.title,
			date: date,
			startTime: time,
			pomoDuration: Number(data.pomoDuration),
			shortBreakDuration: Number(data.shortBreakDuration),
			longBreakDuration: Number(data.longBreakDuration),
			category: category
		};

		try {
			if (taskForm.form.uuid) {
				await dispatch(updateTaskAsync(form)).unwrap();
			} else {
				await dispatch(createTaskAsync(form)).unwrap();
			}
		} catch (err) {
			console.log(`${taskForm ? "Update" : "Create"} task Error => `, err);
		}
		handleClose(false);
	};

	return (
		<div className={`overflow-y-auto scroll-bar-none flex justify-center`}>
			<div className="w-[300px] min-h-[340px]">
				<div className={`bg-white rounded pt-2 pb-2 mb-4 flex flex-col`}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={`mb-4`}>
							<label className={`block text-sm font-bold mb-2`}>Title</label>
							<input
								{...register("title")}
								className={`shadow appearance-none border rounded w-full py-2 px-3 text-sm ${
									errors.title ? "border-[red]" : ""
								}`}
								id="title"
								type="text"
								placeholder="Title task"
								defaultValue={taskForm.form.title || ""}
							/>
							{errors?.title && (
								<p className={`text-[red] text-sm mt-2 pl-3`}>
									{errors.title.message}
								</p>
							)}
						</div>
						<div className="mb-6 flex flex-row justify-between">
							<div className="w-[50%] mr-2">
								<label className={`block text-sm font-bold mb-2`}>Date</label>
								<CustomDatePicker
									dateValue={dayjs(date).toDate()}
									handleSetDate={setDate}
									customInput={
										<input
											className={`shadow appearance-none border text-sm rounded w-full py-2 px-3 text-center`}
											id="date"
											type="text"
											placeholder="Date"
										/>
									}
								/>
							</div>
							<div className="w-[50%]">
								<label className={`block text-sm font-bold mb-2`}>
									Start Time
								</label>
								<CustomTimePicker handleSetTime={_handleSetTime} value={time} />
							</div>
						</div>
						<div className="mb-6 flex flex-row justify-between">
							<div className="mr-1">
								<label className={`block text-sm font-bold mb-2`}>
									Pomodoro
								</label>
								<input
									{...register("pomoDuration")}
									className={`shadow appearance-none border text-sm rounded w-full py-2 px-3 text-center ${
										errors.pomoDuration ? "border-[red]" : ""
									}`}
									id="pomoDuration"
									type="number"
									placeholder="25"
									defaultValue={taskForm.form.pomoDuration || 25}
									min={1}
								/>
								{errors?.pomoDuration && (
									<p className={`text-[red] text-sm mt-2 pl-3`}>
										{errors.pomoDuration.message}
									</p>
								)}
							</div>
							<div className="mr-1">
								<label className={`block text-sm font-bold mb-2`}>
									Short break
								</label>
								<input
									{...register("shortBreakDuration")}
									className={`shadow appearance-none border text-sm rounded w-full py-2 px-3 text-center ${
										errors.shortBreakDuration ? "border-[red]" : ""
									}`}
									id="shortBreakDuration"
									type="number"
									placeholder="5"
									defaultValue={taskForm.form.shortBreakDuration || 5}
									min={1}
								/>
								{errors?.shortBreakDuration && (
									<p className={`text-[red] text-sm mt-2 pl-3`}>
										{errors.shortBreakDuration.message}
									</p>
								)}
							</div>
							<div>
								<label className={`block text-sm font-bold mb-2`}>
									Long break
								</label>
								<input
									{...register("longBreakDuration")}
									className={`shadow appearance-none border text-sm rounded w-full py-2 px-3 text-center ${
										errors.longBreakDuration ? "border-[red]" : ""
									}`}
									id="long_break_duration"
									type="number"
									placeholder="15"
									defaultValue={taskForm.form.longBreakDuration || 15}
									min={1}
								/>
								{errors?.longBreakDuration && (
									<p className={`text-[red] text-sm mt-2 pl-3`}>
										{errors.longBreakDuration.message}
									</p>
								)}
							</div>
						</div>
						<div className="mb-6 flex flex-row justify-between">
							<div className="flex items-center">
								<label className={`block text-sm font-bold text-center`}>
									Category
								</label>
							</div>
							<div className="w-[200px] ml-4" ref={selectContainer}>
								<button
									id="category-button"
									className="flex shadow appearance-none border text-sm rounded w-full py-2 px-3 text-center"
									type="button"
									onClick={() => setOpenSelect(!openSelect)}
								>
									{CmpIcons.CategoryIconSet.map((c, i) => {
										if (category.toUpperCase() === c.key.toUpperCase()) {
											let Icon = c.icon;
											return <Icon key={'sel_ico_'+c.key} className="ml-6 mr-4 text-[20px]" />;
										}
									})}
									{category.toUpperCase()}
								</button>
								<div
									className={`py-2 absolute flex flex-col h-[160px] overflow-y-scroll w-[200px] border bg-white ${
										openSelect ? "" : "hidden"
									}`}
								>
									{CmpIcons.CategoryIconSet.map((category, i) => {
										let Icon = category.icon;
										return (
											<div
												key={"category_" + i}
												className="cursor-pointer"
												onClick={(e) => {
													e.preventDefault();
													setCategory(category.key);
													setOpenSelect(false);
												}}
											>
												<div className="m-1 py-1 flex hover:bg-slate-200">
													<Icon className="ml-8 text-[20px]" />
													<h6 className="ml-4 text-[14px]">
														{category.key.toUpperCase()}
													</h6>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
						<div className={`flex items-center`}>
							{taskForm.status === "pending" ? (
								<Image
									className={`mx-auto px-4`}
									width={"70px"}
									height={`40px`}
									src="/images/bar_load.svg"
									alt="Pending when createTask!"
								/>
							) : (
								<button
									type="submit"
									className="bg-neutral-400 hover:bg-[#f87171] text-[#fff] py-2 px-4 rounded transition-all duration-75 w-full"
								>
									{taskForm.form.uuid ? "Update" : "Create"}
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default TaskForm;
