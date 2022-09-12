import React, { useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "../../store/hook";
import { TaskForm, TasksState } from "../../store/slices/task/type";
import { RootState } from "../../store/store";
import { shallowEqual } from "react-redux";
import { default as dayjs } from "dayjs";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);


export const default_option: any = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "Chart.js Bar Chart",
		},
	},
};


interface RootObject {
	labels: string[];
	datasets: Dataset[];
}

interface Dataset {
	label: string;
	data: number[];
	backgroundColor: string;
}

type TBarOption = {
	range: Date[];
	summaryBy: "week" | "month" | "year";
};

export default function BarReport(props: TBarOption) {
	const { range, summaryBy = 'week' } = props;

	const taskState: TasksState = useAppSelector(
		(state: RootState) => state.task.state,
		shallowEqual
	);

	const [dataSets, setDataSets] = useState<RootObject>({
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		datasets: [
			{
				label: "Success",
				data: [],
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
			{
				label: "Inprogress.",
				data: [],
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	});

	useEffect(() => {
		if (summaryBy === "week") {
			let successTask = [];
			let unSuccessTask = [];
			for (let index = 0; index < 7; index++) {
				let dayEquaTask = taskState.forms.filter((task) => {
					return (
						dayjs(range[0]).add(index, "day").format("YYYY-MM-DD") ===
						dayjs(task.date).format("YYYY-MM-DD")
					);
				});

				successTask.push(
					dayEquaTask.filter((taks) => {
						return taks.status === "success";
					}).length
				);
				unSuccessTask.push(
					dayEquaTask.filter((taks) => {
						return taks.status !== "success";
					}).length
				);
			}

			let day_data: RootObject = {
				labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				datasets: [
					{
						label: "Success",
						data: successTask,
						backgroundColor: "rgba(53, 162, 235, 0.5)",
					},
					{
						label: "Inprogress.",
						data: unSuccessTask,
						backgroundColor: "rgba(255, 99, 132, 0.5)",
					},
				],
			};
			setDataSets(day_data);
		} else if (summaryBy === "month") {
			let successTask = [];
			let unSuccessTask = [];
			let label = [];
			for (let index = 0; index < 4; index++) {

				let maxDate = dayjs(range[0]).add(7 * (index + 1), 'day');
				let minDate = maxDate.add(-7, 'day');
				let endOfMonth = maxDate.endOf('M').format('DD');

				label.push(minDate.format('M / DD') + '-' + (index === 3 ? endOfMonth : maxDate.add(-1, 'day').format('DD')));

				let dayEquaTask = taskState.forms.filter((task) => {
					return (
						dayjs(task.date).format("YYYY-MM-DD") >= minDate.format("YYYY-MM-DD") &&
						dayjs(task.date).format("YYYY-MM-DD") < (
							(index === 3) ?
								endOfMonth :
								maxDate.format("YYYY-MM-DD")
						)
					);
				});

				successTask.push(
					dayEquaTask.filter((taks) => {
						return taks.status === "success";
					}).length
				)
				unSuccessTask.push(
					dayEquaTask.filter((taks) => {
						return taks.status !== "success";
					}).length
				)
			}

			let day_data: RootObject = {
				labels: label,
				datasets: [
					{
						label: "Success",
						data: successTask,
						backgroundColor: "rgba(53, 162, 235, 0.5)",
					},
					{
						label: "Inprogress.",
						data: unSuccessTask,
						backgroundColor: "rgba(255, 99, 132, 0.5)",
					},
				],
			};
			setDataSets(day_data);
		} else if (summaryBy === "year") {
			let successTask = [];
			let unSuccessTask = [];
			let label = [];

			for (let index = 0; index < 12; index++) {

				let startDate = dayjs(range[0]).month(index);
				let endDate = startDate.endOf('M');

				label.push(startDate.format('M'));

				let dayEquaTask = taskState.forms.filter((task) => {
					return (
						dayjs(task.date).format("YYYY-MM-DD") >= startDate.format("YYYY-MM-DD") &&
						dayjs(task.date).format("YYYY-MM-DD") < endDate.format("YYYY-MM-DD")
					);
				});

				successTask.push(
					dayEquaTask.filter((taks) => {
						return taks.status === "success";
					}).length
				)
				unSuccessTask.push(
					dayEquaTask.filter((taks) => {
						return taks.status !== "success";
					}).length
				)

				let day_data: RootObject = {
					labels: label,
					datasets: [
						{
							label: "Success",
							data: successTask,
							backgroundColor: "rgba(53, 162, 235, 0.5)",
						},
						{
							label: "Inprogress.",
							data: unSuccessTask,
							backgroundColor: "rgba(255, 99, 132, 0.5)",
						},
					],
				};
				setDataSets(day_data);
			}
		}
	}, [range]);

	// return <div>RPPP</div>;
	return <Bar options={default_option} data={dataSets} />;
}
