import { useEffect, useState } from "react";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import { default as dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

import BarReport from "../components/reports/bar";

export default function Report() {

	const [summaryBy, setSummaryBy] = useState<"week" | "month" | "year">("week");
	const [currPoint, setCurrPoint] = useState<Number>(dayjs().week());
	const [range, setRange] = useState<Date[]>([
		dayjs().week(Number(currPoint)).toDate(),
		dayjs().week(Number(currPoint)).add(6, "day").toDate()
	]);

	// const []

	useEffect(() => {
		if (summaryBy === "week") {
			setCurrPoint(dayjs().week());
			setRange([
				dayjs().week(Number(dayjs().week())).toDate(),
				dayjs().week(Number(dayjs().week())).add(6, "day").toDate()
			]) 
		} else if (summaryBy === "month") {
			setCurrPoint(dayjs().month());
			setRange([
				dayjs().month(Number(dayjs().month())).startOf('M').toDate(),
				dayjs().month(Number(dayjs().month())).endOf('M').toDate()
			])  
		} else if (summaryBy === "year") {
			setCurrPoint(dayjs().year());
			setRange([
				dayjs().year(Number(dayjs().year())).startOf('y').toDate(),
				dayjs().year(Number(dayjs().year())).endOf('y').toDate()
			]) 
		}
	}, [summaryBy]);

	const _handleChangeRange = (act: string) => {
		let cvtCurr = Number(currPoint);

		let first = dayjs().toDate();
		let last = dayjs().toDate();

		if (act === "prev") {
			setCurrPoint(cvtCurr - 1);
			switch (summaryBy) {
				case "month":
					first = dayjs().month(cvtCurr - 1).startOf('M').toDate();
					last = dayjs().month(cvtCurr - 1).endOf('M').toDate();
					break;
				case "year":
					first = dayjs().year(cvtCurr - 1).startOf('y').toDate();
					last = dayjs().year(cvtCurr - 1).endOf('y').toDate();
					break;
				default:
					first = dayjs().week(cvtCurr - 1).toDate();
					last = dayjs().week(cvtCurr - 1).add(6, "day").toDate();
					break;
			}
		} else {

			setCurrPoint(cvtCurr + 1);
			switch (summaryBy) {
				case "month":
					first = dayjs().month(cvtCurr + 1).startOf('M').toDate();
					last = dayjs().month(cvtCurr + 1).endOf('M').toDate();
					break;
				case "year":
					first = dayjs().year(cvtCurr + 1).startOf('y').toDate();
					last = dayjs().year(cvtCurr + 1).endOf('y').toDate();
					break;
				default:
					first = dayjs().week(cvtCurr + 1).toDate();
					last = dayjs().week(cvtCurr + 1).add(6, "day").toDate();
					break;
			}
		} 
		setRange([first, last]);
	};

	const _selectedDisplay = () => {
		let res: string = "";
		let diff = dayjs().week() - Number(currPoint);
		res = dayjs(range[0]).format("(ddd) DD - MMM");

		if (summaryBy === "month") {
			diff = dayjs().month() - Number(currPoint);
			res = dayjs(range[1]).format("MMM - YYYY")
		} else if (summaryBy === "year") {
			diff = dayjs().year() - Number(currPoint);
			res = dayjs(range[1]).format("YYYY")
		}
		return res;
	};

	return (
		<>
			<div className="flex flex-col">
				<div className="flex justify-center">
					<div className="w-[320px]">
						<div className=" mt-4 flex justify-between ">
							<h5 className="text-zinc-700"> Summary</h5>
						</div>

						<div className="flex justify-center pt-2">
							<div className="flex justify-center">
								<div className="w-[320px] flex flex-col pt-4">
									<ul className="w-full flex justify-between text-sm font-medium text-center text-gray-500 dark:text-gray-400">
										<li className="mr-2 w-1/3">
											<a
												href="#"
												className={`w-full inline-block py-3 px-4 rounded-lg  
												${summaryBy === "week"
														? "bg-[#f87171] text-white"
														: "hover:text-gray-900 hover:bg-gray-100"
													}`}
												onClick={() => setSummaryBy("week")}
											>
												Day
											</a>
										</li>
										<li className="mr-2 w-1/3">
											<a
												href="#"
												className={`w-full inline-block py-3 px-4 rounded-lg 
												${summaryBy === "month"
														? "bg-[#f87171] text-white"
														: "hover:text-gray-900 hover:bg-gray-100"
													}`}
												onClick={() => setSummaryBy("month")}
											>
												Week
											</a>
										</li>
										<li className="mr-2 w-1/3">
											<a
												href="#"
												className={`w-full inline-block py-3 px-4 rounded-lg 
												${summaryBy === "year"
														? "bg-[#f87171] text-white"
														: "hover:text-gray-900 hover:bg-gray-100"
													}`}
												onClick={() => setSummaryBy("year")}
											>
												Month
											</a>
										</li>
									</ul>

									<div className="flex justify-between mt-4 text-zinc-400">
										<div className={`flex flex-col justify-center`}>
											<AiOutlineLeftCircle
												className={`text-[28px] cursor-pointer transition-all duration-100 hover:text-zinc-600`}
												onClick={() => _handleChangeRange("prev")}
											/>
										</div>
										<div className="mx-2 flex flex-col justify-center">
											<h6>{_selectedDisplay() || null}</h6>
										</div>
										<div className={`flex flex-col justify-center`}>
											<AiOutlineRightCircle
												className={`text-[28px] cursor-pointer transition-all duration-100 hover:text-zinc-600`}
												onClick={() => _handleChangeRange("next")}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-center pt-2">
							<div className="flex justify-center">
								<div className="w-[320px]">
									<BarReport range={range} summaryBy={summaryBy} />
								</div>
							</div>
						</div>

						{/* <div className="flex justify-center pt-4 border-t">
							<div className="flex justify-center">
								<div className="w-[320px] flex p-4 drop-shadow-lg bg-white rounded-xl">
									<div className="px-2 justify-between w-[40%]">
										<div className="w-[80px] h-[80px]">
											<h6>0</h6>
										</div>
									</div>
									<div className="px-2 w-[60%] flex flex-col justify-center items-center">
										<h6 className="text-[20px]">Hours focused</h6>
										<p className="text-[16px] text-zinc-500">It look great.</p>
									</div>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
}
