import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineMore } from "react-icons/ai";
import { useAppDispatch } from "../../store/hook";
import { openModalAsync } from "../../store/slices/app-modal/app-modal.slice";
import { deleteTaskAsync } from "../../store/slices/task/form.slice";
import { TTaskForm } from "../../store/slices/task/type";

interface IFocusNavbar {
	title: string;
	selectTask: TTaskForm;
	isFocus: boolean;
}

function FocusNavbar(props: IFocusNavbar) {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const { title, selectTask, isFocus } = props;

	const container = useRef<HTMLDivElement>(null);
	const [optionIsOpen, setOptionIsOpen] = useState(false);

	useEffect(() => {
		document.addEventListener("mousedown", function (event) {
			const target = event.target as HTMLElement;
			if (container.current && !container.current.contains(target)) {
				setOptionIsOpen(false);
			}
		});
	}, []);

	const stopTask = async () => {
		for (let i = 1; i < 9999; i++) {
			window.clearInterval(i);
		}
		return true;
	};

	const _handleOptionClick = () => {
		setOptionIsOpen(!optionIsOpen);
	};

	const handleDeleteTask = () => {
		dispatch(
			openModalAsync({
				isVisible: true,
				type: "confirm",
				contents: (
					<>
						<h6>
						Want to delete <b className="text-red-300">{selectTask.title}</b> task?
						</h6>
					</>
				),
				handleConfirm: async () => {
					await dispatch(deleteTaskAsync(selectTask));
					router.push("/task");
				},
				handleCancel: () => {
					openModalAsync({ isVisible: false });
				},
			})
		);
	};

	return (
		<div className="border-b top-0 fixed w-[100%] h-[60px] bg-white z-10">
			<nav className="mx-auto p-[0.6rem] h-[60px]">
				<div className={`flex justify-between py-1`}>
					<div className="flex">
						<AiOutlineLeft
							className={`text-[28px] text-zinc-500 hover:text-zinc-700 cursor-pointer`}
							onClick={async () => {
								await stopTask();
								router.back();
							}}
						/>
					</div>
					<div>
						<h2 className={`text-[20px] text-zinc-500 cursor-pointer`}>
							{title}
						</h2>
					</div>
					<div ref={container}>
						<AiOutlineMore
							className={`text-[28px] text-zinc-500 hover:text-zinc-700 ${
								isFocus ? "" : "cursor-pointer"
							}`}
							onClick={() => {
								_handleOptionClick();
							}}
						/>
						{optionIsOpen && !isFocus && (
							<div className={`absolute bg-white right-1 border rounded-md`}>
								<ul>
									<li
										className={`p-2 cursor-pointer m-1 hover:bg-zinc-100`}
										onClick={() => {
											dispatch(
												openModalAsync({ isVisible: true, type: "task_form" })
											);
											setOptionIsOpen(false);
										}}
									>
										Edit
									</li>
									<li
										className={`p-2 cursor-pointer m-1 hover:bg-zinc-100 text-red-500`}
										onClick={() => handleDeleteTask()}
									>
										Delete
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</nav>
		</div>
	);
}

export default FocusNavbar;
