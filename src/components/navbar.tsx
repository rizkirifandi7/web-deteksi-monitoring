"use client";

import { History, House, LogOut, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card } from "./ui/card";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push("/login");
		} catch (error) {
			console.error("Gagal untuk logout:", error);
		}
	};

	return (
		<div className="py-4">
			<Card className="grid grid-cols-4 items-center justify-center w-full text-center text-sm font-medium shadow-none rounded-md py-0">
				<Link
					href={"/dashboard/sensor"}
					className={`py-5 flex flex-col justify-center items-center text-xs md:text-sm ${
						pathname == "/dashboard/sensor"
							? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
							: ""
					}`}
				>
					<House size={20} />
					Sensor
				</Link>
				<Link
					href={"/dashboard/kontrol"}
					className={`py-5 flex flex-col justify-center items-center text-xs md:text-sm ${
						pathname == "/dashboard/kontrol"
							? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
							: ""
					}`}
				>
					<SlidersHorizontal size={20} />
					Kontrol
				</Link>
				<Link
					href={"/dashboard/histori"}
					className={`py-5 flex flex-col justify-center items-center text-xs md:text-sm ${
						pathname == "/dashboard/histori"
							? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
							: ""
					}`}
				>
					<History size={20} />
					Histori
				</Link>

				<button
					onClick={handleLogout}
					className={`py-5 flex flex-col justify-center items-center text-xs md:text-sm  dark:hover:bg-red-950/50 rounded-r-md transition-colors ${
						pathname == "/dashboard/logout"
							? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
							: ""
					}`}
				>
					<LogOut size={20} />
					Logout
				</button>
			</Card>
		</div>
	);
};

export default Navbar;
