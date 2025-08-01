// components/charts/ChartPieGas.tsx

"use client";

import * as React from "react";
import { Pie, PieChart, Label, LabelProps } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

// Tipe untuk level bahaya
interface DangerLevels {
	LOW: number;
	HIGH: number;
}

// Tipe untuk props komponen
interface ChartPieGasProps {
	gasValue?: number;
	maxPpm?: number;
}

const DANGER_LEVELS: DangerLevels = {
	LOW: 200, // Batas aman
	HIGH: 300, // Batas siaga
};

// Definisikan ChartConfig dengan tipe yang sesuai
const chartConfig = {
	gas: {
		label: "Gas (PPM)",
	},
	safe: {
		label: "Aman",
		color: "#34D399", // Warna hijau (emerald)
	},
	warning: {
		label: "Siaga",
		color: "#FBBF24", // Warna kuning (amber)
	},
	danger: {
		label: "Bahaya",
		color: "#EF4444", // Warna merah
	},
	track: {
		label: "Track",
		color: "#E5E7EB", // Warna latar
	},
} satisfies ChartConfig;

export const GasStatusCard: React.FC<ChartPieGasProps> = ({
	gasValue = 0,
	maxPpm = 1000,
}) => {
	const chartData = React.useMemo(() => {
		const gasLevelColor =
			gasValue < DANGER_LEVELS.LOW
				? chartConfig.safe.color
				: gasValue < DANGER_LEVELS.HIGH
				? chartConfig.warning.color
				: chartConfig.danger.color;

		return [
			{
				name: "gas",
				value: gasValue,
				fill: gasLevelColor,
			},
			{
				name: "track",
				value: Math.max(0, maxPpm - gasValue),
				fill: chartConfig.track.color,
			},
		];
	}, [gasValue, maxPpm]);

	const getGasTextColorClass = (ppm: number): string => {
		if (!DANGER_LEVELS) return "fill-muted-foreground";
		return ppm < DANGER_LEVELS.LOW
			? "fill-emerald-400"
			: ppm < DANGER_LEVELS.HIGH
			? "fill-amber-400"
			: "fill-red-500";
	};

	return (
		<Card className="border rounded-md shadow-none">
			<CardHeader className="text-center border-b">
				<CardTitle>Sensor Gas Status</CardTitle>
				<CardDescription>Deteksi tingkat gas</CardDescription>
			</CardHeader>
			<div className="h-[170px] w-full">
				<ChartContainer
					config={chartConfig}
					className="mx-auto my-auto aspect-square max-h-[170px]"
				>
					<PieChart>
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							innerRadius={55}
							outerRadius={75}
							startAngle={90}
							endAngle={-270}
							strokeWidth={0}
							cornerRadius={10}
						>
							<Label
								content={({ viewBox }: LabelProps) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className={`text-3xl font-bold ${getGasTextColorClass(
														gasValue
													)}`}
												>
													{gasValue}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-slate-400 text-base uppercase tracking-widest"
												>
													PPM
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</div>
			<div className="text-center">
				<p className="text-sm text-neutral-400 dark:text-neutral-400">
					Status Gas:
				</p>
				<Badge
					className={`mt-2 px-4 py-1 text-sm font-bold tracking-wider ${
						gasValue < DANGER_LEVELS.LOW
							? "bg-emerald-500 text-white"
							: gasValue < DANGER_LEVELS.HIGH
							? "bg-amber-500 text-white"
							: "bg-red-500 text-white"
					}`}
				>
					{gasValue < DANGER_LEVELS.LOW
						? "AMAN"
						: gasValue < DANGER_LEVELS.HIGH
						? "SIAGA"
						: "BAHAYA"}
				</Badge>
			</div>
		</Card>
	);
};
