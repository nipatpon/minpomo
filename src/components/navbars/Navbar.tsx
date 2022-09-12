import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { openModalAsync } from "../../store/slices/app-modal/app-modal.slice";
import { initTaskAsync } from "../../store/slices/task/form.slice";

interface INav { }

export default function Navbar({ }: INav) {
	const router = useRouter();
	const dispatch = useAppDispatch();


	const handleOpenCreateTask = async () => {
		await dispatch((initTaskAsync()));
		dispatch((openModalAsync({ isVisible: true, type: 'task_form' })));
	};

	return (
		<div className="w-[100%]">
			<div className="border-b top-0 fixed w-[100%] h-[60px] bg-white z-10">
				{/* <div className="border-b bottom-0 fixed w-[320px] sm:w-[480px]"> */}
				<nav className="mx-auto p-[0.6rem] h-[60px]">
					<div className={`flex justify-between py-1`}>
						<div className="flex">
							<h5 className={`text-[22px] text-[#f87171] cursor-pointer`}>
								<b>MINPOMO</b>
							</h5>
						</div>
						<div></div>
						<div className={`flex`}> 
							{
								(
									router.pathname.includes('/task') ||
									router.pathname === '/'
								) &&
								<div
									className={`text-[32px] cursor-pointer transition-all duration-100 text-zinc-500 hover:text-[#f87171]`}
									onClick={() => handleOpenCreateTask()}
								>
									<AiFillPlusCircle />
								</div>
							}
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}
