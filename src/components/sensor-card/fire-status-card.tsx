import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ShieldCheck } from "lucide-react";

interface FireStatusProps {
	fireStatus?: string;
}

const FireStatusCard: React.FC<FireStatusProps> = ({ fireStatus }) => {
	const isDanger = fireStatus === "Terdeteksi";

	return (
		<Card
			className={`border shadow-none rounded-md transition-all duration-300 `}
		>
			<CardHeader className="text-center border-b pb-3">
				<CardTitle>Sensor Api</CardTitle>
				<CardDescription>Deteksi api real-time</CardDescription>
			</CardHeader>

			{/* === Icon dan Status === */}
			<CardContent className="flex flex-col items-center justify-center h-full">
				<div className="relative">
					{isDanger ? (
						<Flame
							size={150}
							className="text-red-400 relative z-10 animate-pulse"
							strokeWidth={2.5}
						/>
					) : (
						<ShieldCheck
							size={150}
							className="text-emerald-400 relative z-10"
							strokeWidth={2.5}
						/>
					)}
				</div>
			</CardContent>

			{/* === Status Badge === */}
			<div className="text-center">
				<p className="text-sm text-neutral-400 dark:text-neutral-400">
					Status Api:
				</p>
				<Badge
					className={`mt-2 px-4 py-1 text-sm font-bold tracking-wider ${
						isDanger ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
					}`}
				>
					{isDanger ? "API TERDETEKSI" : "AMAN"}
				</Badge>
			</div>
		</Card>
	);
};

export default FireStatusCard;
