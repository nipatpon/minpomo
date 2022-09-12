import React, { useEffect, useState, useRef, useMemo } from "react";
import { Fragment } from "react";
import { Tab } from "@headlessui/react";

import ControlPanel from "./control-panel";
import { TTaskForm } from "../../store/slices/task/type";

const coreHeadTab = [
	{
		id: 1,
		name: "Pomodoro",
		options: {},
	},
	{
		id: 2,
		name: "Short Break",
		options: {},
	},
	{
		id: 3,
		name: "Long Break",
		options: {},
	},
];

let interval: any;
let time: number = 0;

interface IPomoCore {
	taskForm?: TTaskForm;
	isFocus: Function;
	callback: Function;
}

function PomoCore(props: IPomoCore) {
	const { taskForm, callback, isFocus } = props;
	const audioPlayer: any = useRef(null);

	const [displayTime, setDisplayTime] = useState("");
	const [activeAt, setActiveAt] = useState(0);
	const [pomoTime, setPomoTime] = useState((taskForm?.pomoDuration || 25) * 60);
	const [shortBreakTime, setShortBreakTime] = useState(
		(taskForm?.shortBreakDuration || 5) * 60
	);
	const [longBreakTime, setLongBreakTime] = useState(
		(taskForm?.longBreakDuration || 15) * 60
	);
	const [pomoCount, setPomoCount] = useState(0);
	const [pauseClicked, setPauseClicked] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setPomoTime((taskForm?.pomoDuration || 25) * 60);
		setShortBreakTime((taskForm?.shortBreakDuration || 5) * 60);
		setLongBreakTime((taskForm?.longBreakDuration || 15) * 60);
		setPomoCount(taskForm?.round || 0);
		_reload();
		time = (taskForm?.pomoDuration || 25) * 60;
		switch (activeAt) {
			case 1:
				time = (taskForm?.shortBreakDuration || 5) * 60;
				break;
			case 2:
				time = (taskForm?.longBreakDuration || 15) * 60;
				break;
		}
		calDisplay(time);
	}, [taskForm]);

	useEffect(() => {
		isFocus(progress !== 0);
	}, [progress]);

	function playAudio() {
		audioPlayer.current.play();
	}

	const calDisplay = (time: number, minutes?: string, seconds?: string) => {
		minutes = Math.floor(Number(time / 60)).toString();
		seconds = Math.floor(Number(time % 60)).toString();

		minutes = Number(minutes) < 10 ? "0" + minutes : minutes;
		seconds = Number(seconds) < 10 ? "0" + seconds : seconds;

		if (time < 0) {
			_skip();
			playAudio();
			clearInterval(interval);
		} else {
			let pgTime = pomoTime;
			switch (activeAt) {
				case 1:
					pgTime = shortBreakTime;
					break;
				case 2:
					pgTime = longBreakTime;
					break;
			}
			setProgress(((pgTime - time) * 100) / pgTime);
			setDisplayTime(minutes + ":" + seconds);
		}
	};

	const changeTab = (tabIndex: number) => {
		setActiveAt(tabIndex);
		_reload(tabIndex);
	};

	const stopTask = () => {
		for (let i = 1; i < 9999; i++) {
			window.clearInterval(i);
		}
	};

	const _playPause = () => {
		setPauseClicked(!pauseClicked);

		if (pauseClicked) { 
			clearInterval(interval);
		} else {
			stopTask();
			let minutes: string = "";
			let seconds: string = "";
			interval = setInterval(() => {
				time = time - 1;
				calDisplay(time, minutes, seconds);
			}, 1000);
		}
	};

	const _reload = (tabIndex: number = activeAt) => {
		clearInterval(interval);
		switch (tabIndex) {
			case 1:
				time = shortBreakTime;
				calDisplay(60 * (taskForm?.shortBreakDuration || 5));
				break;
			case 2:
				time = longBreakTime;
				calDisplay(60 * (taskForm?.longBreakDuration || 15));
				break;
			default:
				time = pomoTime;
				calDisplay(60 * (taskForm?.pomoDuration || 25));
				break;
		}
		setProgress(0);
		setPauseClicked(false);
	};

	const _skip = () => {
		switch (activeAt) {
			case 1:
				setActiveAt(0);
				_reload(0);
				break;
			case 2:
				setActiveAt(0);
				_reload(0);
				break;
			default:
				if ((pomoCount + 1) % 4 === 0) {
					setActiveAt(2);
					_reload(2);
				} else {
					setActiveAt(1);
					_reload(1); 
				}
				callback({
					pomoCount: pomoCount + 1,
				});
				setPomoCount(pomoCount + 1);
				break;
		}
	};

	return (
		<>
			<Tab.Group
				selectedIndex={activeAt}
				onChange={(index) => changeTab(index)}
			>
				<Tab.List
					className={`w-full h-fit list-none m-0 p-0 flex justify-center`}
				>
					{coreHeadTab.map((core, index) => {
						return (
							<Tab as={Fragment} key={`Tab` + index}>
								{({ selected }) => (
									<button
										type="button"
										disabled={progress > 0}
										className={`mx-4 px-2 text-gray-500 outline-0 ${
											selected
												? "text-[#f87171] border-b-2 border-[#f87171]"
												: ""
										}`}
										onClick={() => stopTask()}
									>
										{core?.name || "Tab Name"}
									</button>
								)}
							</Tab>
						);
					})}
				</Tab.List>
				<Tab.Panels className={`p-2`}>
					{coreHeadTab.map((core) => {
						return (
							<Tab.Panel key={`panel` + core.id}>
								<div>
									<br />
									{pomoCount > 0 ? (
										<h5 className={` text-[#282727] text-center `}>
											Round #{pomoCount}
										</h5>
									) : null}
									<h1 className="text-[grey] text-center text-[86px]">
										{displayTime}
									</h1>
								</div>

								<ControlPanel
									reload={_reload}
									playPause={_playPause}
									skip={_skip}
									progress={progress}
								/>
							</Tab.Panel>
						);
					})}
				</Tab.Panels>
			</Tab.Group>
			<audio ref={audioPlayer} src={"/sounds/933.mp3"} />
		</>
	);
}

export default PomoCore;
