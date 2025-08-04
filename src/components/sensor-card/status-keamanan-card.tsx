import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fan, ShowerHead, Bell, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActuatorStatus, StatusKeamananCardProps } from "@/types/types";

// Definisikan data aktuator di satu tempat (Prinsip DRY)
const actuators = [
	{
		name: "Kipas Angin",
		Icon: Fan,
		statusKey: "kipas_aktif" as keyof ActuatorStatus,
	},
	{
		name: "Pompa Air",
		Icon: ShowerHead,
		statusKey: "pompa_aktif" as keyof ActuatorStatus,
	},
	{
		name: "Buzzer & LED",
		Icon: Bell,
		statusKey: "alarm_aktif" as keyof ActuatorStatus,
	},
];

// Komponen kecil untuk setiap item aktuator
const ActuatorItem: React.FC<{
	name: string;
	Icon: React.FC<LucideProps>;
	isActive: boolean;
}> = ({ name, Icon, isActive }) => (
	<div
		className={cn(
			"flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all duration-300",
			isActive
				? "bg-emerald-50 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-950/30 dark:text-emerald-400"
				: "dark:bg-neutral-800 "
		)}
	>
		<Icon className="h-7 w-7 md:h-8 md:w-8" />
		<h3 className="text-sm font-medium">{name}</h3>
		<Badge
			variant={isActive ? "default" : "outline"}
			className={cn(
				"text-xs",
				isActive &&
					" bg-emerald-600 text-white hover:bg-emerald-500 dark:border-emerald-500/50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
			)}
		>
			{isActive ? "Aktif" : "Mati"}
		</Badge>
	</div>
);

const StatusKeamananCard: React.FC<StatusKeamananCardProps> = ({ status }) => {
	return (
		<Card className="rounded-md border shadow-none mt-6">
			<CardHeader className="text-center border-b">
				<CardTitle>Status Aktuator</CardTitle>
				<CardDescription className="text-slate-600 dark:text-slate-400">
					Perangkat keamanan yang terhubung.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-3 px-6 grid-cols-2 md:gap-4">
				{actuators.map((actuator) => (
					<ActuatorItem
						key={actuator.name}
						name={actuator.name}
						Icon={actuator.Icon}
						isActive={status?.[actuator.statusKey] ?? false}
					/>
				))}
			</CardContent>
		</Card>
	);
};

export default StatusKeamananCard;
