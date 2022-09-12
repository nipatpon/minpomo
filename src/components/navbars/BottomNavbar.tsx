import React from "react";

import { FaHome, FaUserAlt, FaTasks, FaChartPie } from "react-icons/fa";

import Link from "next/link";
import { useRouter } from "next/router";

interface BottomNav {}
 
export default function BottomNavbar({}: BottomNav) {
	const router = useRouter();

	return (
		<div className="border-t bottom-0 absolute w-[100%] h-[60px]">
			<nav className="mx-auto p-[0.6rem] bg-[#ffffff] h-[60px]">
				<ul className="w-full h-fit list-none m-0 p-0 flex justify-center text-zinc-500">
					<Link href="/">
						<li
							className={`flex flex-col items-center mx-[1rem] cursor-pointer transition delay-50 hover:text-[#f87171] ${
								router.pathname === "/" ? "text-[#f87171]" : ""
							}`}
						>
							<FaHome className="text-[22px]" />
							<h6 className="text-[12px] ">
								Home
							</h6>
						</li>
					</Link>
					<Link href="/task">
						<li
							className={`flex flex-col items-center mx-[1rem] cursor-pointer transition delay-50 hover:text-[#f87171] ${
								router.pathname.includes("/task") ? "text-[#f87171]" : ""
							}`}
						>
							<FaTasks className="text-[22px]" />
							<h6 className="text-[12px] ">
								Task
							</h6>
						</li>
					</Link>
					<Link href="/report">
						<li
							className={`flex flex-col items-center mx-[1rem] cursor-pointer transition delay-50 hover:text-[#f87171] ${
								router.pathname.includes("/report") ? "text-[#f87171]" : ""
							}`}
						>
							<FaChartPie className="text-[22px]" />
							<h6 className="text-[12px] ">
								Report
							</h6>
						</li>
					</Link>
					{/* <Link href="/profile">
						<li
							className={`flex flex-col items-center mx-[1rem] cursor-pointer transition delay-50 hover:text-[#f87171] ${
								(
									router.pathname.includes("/profile") || 
									router.pathname.includes("/auth")
								) ? "text-[#f87171]" : ""
							}`}
						>
							<FaUserAlt className="text-[22px]" />
							<h6 className="text-[12px] ">
								Profile
							</h6>
						</li>
					</Link> */}
				</ul>
			</nav>
		</div>
	);
}
