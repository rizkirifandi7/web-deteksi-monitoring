"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GasStatusCard } from "@/components/sensor-card/gas-status-card";
import FireStatusCard from "@/components/sensor-card/fire-status-card";
import StatusKeamananCard from "@/components/sensor-card/status-keamanan-card";
import useStatusData from "@/hooks/use-data-terkini";

const SensorPage = () => {
	const { data, isLoading, error } = useStatusData();

	if (isLoading) {
		return (
			<div>
				<Skeleton className="h-40 w-full mb-4" />
				<Skeleton className="h-40 w-full mb-4" />
				<Skeleton className="h-40 w-full mb-4" />
			</div>
		);
	}

	if (error) {
		return (
			<Card className="rounded-md shadow-none mt-2">
				<CardHeader className="text-center border-b">
					<CardTitle>Error</CardTitle>
					<CardDescription>{error}</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="mt-2">
			<div className="grid grid-cols-2 gap-4">
				<GasStatusCard gasValue={data?.data_sensor.gas_ppm} />
				<FireStatusCard fireStatus={data?.data_sensor.status_api} />
			</div>

			<StatusKeamananCard status={data?.status_aktuator} />
		</div>
	);
};

export default SensorPage;
