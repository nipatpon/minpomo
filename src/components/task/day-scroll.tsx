import { default as dayjs } from "dayjs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";

interface IDayScroll {
	defaultDate: Date;
	changeDate: Function;
}

type TDayObj = {
	date: String;
	rawDate: Date;
	day: String;
	dayIndex: number;
};

function getDays(defaultDate: Date) {
	let yearMonth = dayjs(defaultDate).format("YYYY-MM-");
	let days: TDayObj[] = [];
	for (let i = 1; i <= dayjs(defaultDate).daysInMonth(); i++) {
		let useDate = yearMonth + (i < 10 ? "0" + i : i);
		days.push({
			rawDate: dayjs(useDate).toDate(),
			date: dayjs(useDate).format("YYYY-MM-DD"),
			day: dayjs(useDate).format("ddd"),
			dayIndex: i,
		});
	}

	for (let index = 0; index < 2; index++) {
		days.unshift({
			rawDate: new Date(),
			date: "",
			day: "",
			dayIndex: 0,
		});
		days.push({
			rawDate: new Date(),
			date: "",
			day: "",
			dayIndex: 0,
		});
	}
	return days;
}

export default function DayScroll(props: IDayScroll) {
	const { defaultDate, changeDate } = props;

	const dayListsRef = useRef<HTMLDivElement>(null);
	const [monthDays, setMonthDays] = useState(getDays(defaultDate));
	const [pointDateX, setPointDateX] = useState(-10000); 

	let rawIsScrolling: boolean = false;
	let rawClientX: number = 0;
	let rawScrollX: number = 0;
	let scrollingTimer: ReturnType<typeof setTimeout>;
	let doneTypingInterval = 500;

	useLayoutEffect(() => {
		mvToDate();
	}, []);

	useEffect(() => {
		if (dayListsRef && dayListsRef.current && pointDateX !== -10000) {
			let dayW = 40;
			let gap = 30;
			let xStartBox = dayListsRef.current.scrollLeft + (dayW * 2 + gap * 2);
			let todayIs = Number((xStartBox / (dayW + gap)).toFixed(0));
			if (xStartBox % (dayW + gap) === 0) {
				changeDate(dayjs(monthDays[todayIs].rawDate).toDate());
			}
		}
	}, [pointDateX]);

	useEffect(() => {
		setMonthDays(getDays(defaultDate));
		mvToDate(); 
	}, [defaultDate]);

	const mvToDate = () => {
		if (dayListsRef && dayListsRef.current) {
			let day = dayjs(defaultDate).format("D"); // start
			let dayW = 40;
			let gap = 30;
			let toPoint = Number(day) * gap + Number(day) * dayW - (gap + gap / 2);
			dayListsRef.current.scrollTo({
				top: 0,
				left: toPoint,
			});
		}
	};

	const _onMouseDown = (e: any) => {
		if (dayListsRef && dayListsRef.current) {
			e.preventDefault();
			dayListsRef.current.classList.remove("snap-x");
			rawIsScrolling = true;
			rawClientX = e.pageX - dayListsRef.current.offsetLeft;
			rawScrollX = dayListsRef.current.scrollLeft;
		}
	};

	const _onMouseLeave = () => {
		if (dayListsRef && dayListsRef.current) {
			dayListsRef.current.classList.add("snap-x");
			rawIsScrolling = false;
		}
	};

	const _onMouseUp = () => {
		if (dayListsRef && dayListsRef.current) {
			dayListsRef.current.classList.add("snap-x");
			rawIsScrolling = false;
		}
	};

	const _onMouseMove = (e: any) => {
		if (dayListsRef && dayListsRef.current) {
			if (!rawIsScrolling) return;
			e.preventDefault();
			const x = e.pageX - dayListsRef.current.offsetLeft;
			const walk = (x - rawClientX) * 1; //scroll-fast
			dayListsRef.current.scrollLeft = rawScrollX - walk;
		}
	};

	const _onScroll = () => {
		clearTimeout(scrollingTimer);
		scrollingTimer = setTimeout(() => {
			if (dayListsRef && dayListsRef.current) {
				setPointDateX(dayListsRef.current.scrollLeft);
			}
		}, doneTypingInterval);
	};

	return (
		<div className="w-[320px] pt-2">
			<div
				className="cursor-pointer relative w-full flex gap-[30px] snap-normal overflow-x-auto no-scrollbar snap-x"
				ref={dayListsRef}
				onMouseDown={_onMouseDown}
				onMouseLeave={_onMouseLeave}
				onMouseUp={_onMouseUp}
				onMouseMove={_onMouseMove}
				onScroll={_onScroll}
			>
				{monthDays.map((day: TDayObj, i: number) => {
					let today: number = Number(dayjs().format("D"));

					return (
						<div className="snap-center drop-shadow-md" key={"day_" + i}>
							<div
								className={`my-2 p-1 text-sm text-center text-white rounded-2xl w-[40px] 
								${
									day.dayIndex >= today
										? "text-red-400 bg-white border-4 border-red-400"
										: day.dayIndex > 0
										? "bg-zinc-400 border-4 border-zinc-400"
										: ""
								}`}
							>
								{day.dayIndex > 0 && (
									<div>
										<h6 className="text-[12px]">{day.day}</h6>
										<h4>{`${day.dayIndex}`}</h4>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex justify-center">
				<AiFillCaretUp className="text-[18px] text-red-400 drop-shadow-md" />
			</div>
		</div>
	);
}
