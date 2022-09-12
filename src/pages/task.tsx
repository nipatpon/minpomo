import { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import {
	AiOutlineLeftCircle,
	AiOutlineRightCircle,
	AiOutlineCloseCircle,
} from "react-icons/ai";
import { FcInfo } from "react-icons/fc";
import { default as dayjs } from "dayjs";
import CustomDatePicker from "../components/utils/datePicker";
import { useRouter } from "next/router";
import { TasksState, TTaskForm } from "../store/slices/task/type";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
	selectTaskAsync,
	deleteTaskAsync,
} from "../store/slices/task/form.slice";
import { openModalAsync } from "../store/slices/app-modal/app-modal.slice";
import DayScroll from "../components/task/day-scroll";
import { shallowEqual } from "react-redux";
import CmpIcons from "../components/icons";  

function TaskBoard() {
	
	const taskState: TasksState = useAppSelector(
		(state: RootState) => state.task.state,
		shallowEqual
	); 
	
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { date } = router.query; 

	const initialDate: Date = date
		? dayjs(date + " 00:00:00").toDate()
		: new Date();

	const [currentDate, setCurrentDate] = useState<Date>();
	const [taskForms, setTaskForms] = useState<TTaskForm[]>([]);

	useEffect(() => {
		if (!!currentDate) {
			let tasks = getTodayTasks(currentDate);
			setTaskForms(tasks);
		}
	}, [currentDate, taskState]);

	const splitHoursMinutes = (time: string) => {
		let [hours, minutes] = time.split(/\W+/);
		return [Number(hours), Number(minutes)];
	};

	const getTodayTasks = (date: Date = new Date()) => {
		let todayTask = taskState.forms.filter(
			(task: TTaskForm) =>
				dayjs(date).format("YYYY-MM-DD") ===
				dayjs(task.date).format("YYYY-MM-DD")
		);
		todayTask = todayTask.sort((a, b) => {
			const [h1, m1] = splitHoursMinutes(a.startTime);
			const [h2, m2] = splitHoursMinutes(b.startTime);
			return h1 - h2 || m1 - m2;
		});

		return todayTask;
	};

	const _handleSetDate = (date: Date) => {
		setCurrentDate(date);
		router.push(
			{
				pathname: "/task",
				query: {
					...router.query,
					date: dayjs(date).format("YYYY-MM-DD"),
				},
			},
			undefined,
			{}
		);
	};

	const _changeDate = (act: string) => {
		let newDate: Date = initialDate;
		if (act === "next") {
			newDate = dayjs(currentDate).add(1, "month").toDate();
		} else {
			newDate = dayjs(currentDate).add(-1, "month").toDate();
		}
		setCurrentDate(newDate);
	};

	const handleDeleteTask = (task: TTaskForm) => {
		dispatch(
			openModalAsync({
				isVisible: true,
				type: "confirm",
				contents: (
					<h6>
						Want to delete `&ldquo;`<b className="text-red-300">{task.title}</b>`&ldquo;` task?
					</h6>
				),
				handleConfirm: () => {
					dispatch(deleteTaskAsync(task));
				},
				handleCancel: () => {
					openModalAsync({ isVisible: false });
				},
			})
		);
	};

	return (
		<div className={`w-full h-fit list-none m-0 p-0`}>
			<div className="bg-white top-[60px]">
				<div
					className={`mt-6 w-full flex justify-center text-xl text-zinc-500`}
				>
					<div className={`flex flex-col justify-center`}>
						<AiOutlineLeftCircle
							className={`text-[32px] cursor-pointer transition-all duration-100 hover:text-zinc-600`}
							onClick={() => {
								_changeDate("back");
							}}
						/>
					</div>
					<div className={`mx-2 flex flex-col justify-center w-[240px]`}>
						<CustomDatePicker
							dateValue={currentDate}
							handleSetDate={_handleSetDate}
							customInput={
								<button className="w-full" type="button" onClick={() => {}}>
									{dayjs(currentDate).format(`MMMM, YYYY`)}
								</button>
							}
						/>
					</div>
					<div className={`flex flex-col justify-center`}>
						<AiOutlineRightCircle
							onClick={() => {
								_changeDate("next");
							}}
							className={`text-[32px] cursor-pointer transition-all duration-100 hover:text-zinc-600`}
						/>
					</div>
				</div>

				<div className="w-full flex justify-center my-2">
					<DayScroll
						defaultDate={currentDate || initialDate}
						changeDate={_handleSetDate}
					/>
				</div>
			</div>

			<div className={`flex justify-center mt-[20px]`}>
				<div className={`w-[320px] h-[400px]`}>
					{taskForms.map((task: TTaskForm) => {
						let Icon =
							CmpIcons.CategoryIconSet.find(
								(CategIcon) => CategIcon.key === task.category
							)?.icon || FcInfo;
						return (
							<div
								key={`tsk_${task.uuid}`}
								className="flex justify-between my-2 cursor-pointer bg-white drop-shadow-sm hover:drop-shadow-md transition duration-100"
							>
								<div
									className="flex w-[80%] p-2"
									onClick={async () => {
										await dispatch(selectTaskAsync(task)).unwrap();
										router.push({
											pathname: `/focus`,
											query: {
												f: task?.uuid,
											},
										});
									}}
								>
									<div className="w-[20%] flex justify-left">
										<div>
											<Icon className="text-[28px] mx-auto" />
											<h6 className="text-[14px] text-zinc-500">
												{task.startTime}
											</h6>
										</div>
									</div>
									<div className="text-left w-[80%] pl-2">
										<h6>{task.title}</h6>
										<p className="text-zinc-400 text-[14px] capitalize">
											{task.round} / {task.roundLimit} {task.status}.
										</p>
									</div>
								</div>
								<div className=" w-[20%] h-[60px] flex justify-center items-center">
									<AiOutlineCloseCircle
										className={`cursor-pointer hover:text-[red] text-[22px] transition-all duration-75`}
										onClick={() => handleDeleteTask(task)}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default TaskBoard;
