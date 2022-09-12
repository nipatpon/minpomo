import { useSession, getCsrfToken } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { default as dayjs } from "dayjs";
import { VscPlayCircle } from "react-icons/vsc";
import { useRouter } from "next/router";
import { shallowEqual } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FcInfo } from "react-icons/fc";

import { TasksState, TTaskForm } from "../store/slices/task/type";
import { selectTaskAsync } from "../store/slices/task/form.slice";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../store/store";

import CmpIcons from "../components/icons";

type TProgressTask = {
	progress: number;
	success: number;
	inprogress: number;
};

let ndate = new Date();
let hours = ndate.getHours();
let Greets =
	hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

export default function Index({}) {
	const taskState: TasksState = useAppSelector(
		(state: RootState) => state.task.state,
		shallowEqual
	);

	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: session } = useSession();

	const [taskForms, setTaskForms] = useState<TTaskForm[]>([]);

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

	const getProgressTasks = () => {
		let success: number = taskForms.filter(
			(task) => task.status === "success"
		).length;
		let inprogress: number = taskForms.filter(
			(task) => task.status !== "success"
		).length; 

		let progress: number = Math.floor((success / taskForms.length) * 100);
		return {
			success,
			inprogress,
			progress,
		};
	};

	const progressTasks: TProgressTask = useMemo(
		() => getProgressTasks(),
		[taskForms]
	);

	useEffect(() => {
		setTaskForms(getTodayTasks());
		getProgressTasks();
	}, [taskState]);

	console.log("progressTasks ", progressTasks);

	return (
		<>
			<div className="flex flex-col">
				<div className="flex justify-center">
					<div className="w-[320px] flex mt-6 text-gray-600 bg-white rounded-xl">
						<h1 className="p-2 text-[20px] drop-shadow-lg">{Greets},</h1>
					</div>
				</div>

				<div className="flex justify-center">
					<div className="w-[320px] flex my-6 p-4 drop-shadow-lg bg-white rounded-xl">
						<div className="px-2 justify-between w-[40%]">
							<div className="w-[80px] h-[80px]">
								<CircularProgressbar
									value={progressTasks?.progress || 0}
									// value={100}
									text={`${progressTasks?.progress || 0}%`}
									styles={{
										
										text: {
											fill: "#f88",
											fontSize: "22px",
										},
										background: {
											fill: "#3ec747",
										},
									}}
								/>
							</div>
						</div>
						<div className="px-2 w-[60%] flex flex-col justify-center items-center">
							<h6 className="text-[20px]">Your focus tasks</h6>
							<p className="text-[16px] text-zinc-500">
								<b>{progressTasks.success}</b> of <b>{taskForms.length}</b>{" "}
								successed.
							</p>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<div className="w-[320px] px-2 flex justify-between text-gray-600 bg-white rounded-xl">
						<h6>Today is tasks ( {taskForms.length} )</h6>
						<div className="flex flex-col justify-center">
							<h6
								className="text-[14px] text-blue-500 hover:text-blue-700 cursor-pointer"
								onClick={() => {
									router.push("/task", {
										query: {
											...router.query,
											date: dayjs().format("YYYY-MM-DD"),
										},
									});
								}}
							>
								More task
							</h6>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<div className="w-[320px]">
						{taskForms.map((task: TTaskForm, i: number) => {
							let Icon =
								CmpIcons.CategoryIconSet.find(
									(CategIcon) => CategIcon.key === task.category
								)?.icon || FcInfo;
							return (
								<div
									key={`tsk_${task.uuid}`}
									className="flex justify-between my-2 cursor-pointer bg-white drop-shadow-sm hover:drop-shadow-md transition duration-100"
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
									<div
										className="flex w-[80%] p-2" 
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
									<div
										className=" w-[20%] h-[60px] flex justify-center items-center" 
									>
										<VscPlayCircle className="text-emerald-600 text-[38px] hover:text-[40px] cursor-pointer" />
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context: any) {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	};
}
