import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
	VscDebugRestart,
	VscDebugStart,
	VscDebugPause,
	VscDebugContinue,
} from "react-icons/vsc";

type IControlPanel = {
	reload: () => void;
	playPause: () => void;
	skip: () => void;
	progress: number;
};

function ControlPanel(props: IControlPanel) {
	const { reload, playPause, skip, progress } = props;
	const [isPlay, setIsPlay] = useState(false);

	useEffect(() => {
		setIsPlay(false);
	}, []);

	useEffect(() => {
		if (progress === 100) setIsPlay(false);
	}, [progress]);

	const actTrigger = () => {
		playPause();
		setIsPlay(!isPlay);
	};

	return (
		<>
			{/* <h1 className='text-center'>{Math.floor(progress)} %</h1> */}
			<ul
				className={`
                flex justify-center
            `}
			>
				<li className="flex items-center">
					{progress > 0 ? (
						<button
							className={`
                                    transition duration-50
                                    p-4 border rounded-full cursor-pointer 
                                    hover:bg-[#f87171] hover:text-[#fff]
                                `}
							onClick={() => {
								setIsPlay(false);
								reload();
							}}
						>
							<VscDebugRestart />
						</button>
					) : null}
				</li>
				<li className={`mx-10`}>
					<button
						className={`
                            transition duration-50
                            p-4 border rounded-full cursor-pointer 
                            hover:bg-[#f87171] hover:text-[#fff]
							text-[40px]
                        `}
						onClick={() => actTrigger()}
					>
						{isPlay ? <VscDebugPause /> : <VscDebugStart />}
					</button>
				</li>
				<li className="flex items-center">
					{progress > 0 ? (
						<button
							className={`
                                    transition duration-50
                                    p-4 border rounded-full cursor-pointer 
                                    hover:bg-[#f87171] hover:text-[#fff]
                                `}
							onClick={() => {
								setIsPlay(false);
								skip();
							}}
						>
							<VscDebugContinue />
						</button>
					) : null}
				</li>
			</ul>
		</>
	);
}

export default ControlPanel;
