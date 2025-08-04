"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Fan, Siren, Droplet } from "lucide-react"; // Ganti FireExtinguisher
import { DataControl, KontrolProps } from "@/types/types";

// Definisikan data kontrol di satu tempat agar efisien
const controls = [
	{
		id: "buzzer-switch",
		label: "Buzzer & LED",
		description: "Kontrol Buzzer & LED",
		Icon: Siren,
		dataKey: "buzzer" as keyof DataControl,
	},
	{
		id: "pompa-switch",
		label: "Pompa Air",
		description: "Kontrol Pompa",
		Icon: Droplet,
		dataKey: "pump" as keyof DataControl,
	},
	{
		id: "kipas-switch",
		label: "Kipas Ventilasi",
		description: "Kontrol Kipas",
		Icon: Fan,
		dataKey: "fan" as keyof DataControl,
	},
];

const Kontrol: React.FC<KontrolProps> = ({
	data,
	updateControl,
	isUpdating,
}) => {
	const isManualMode = data?.mode === "manual";
	return (
		<Card className="rounded-md border shadow-sm mt-2">
			<CardHeader className="text-center border-b">
				<CardTitle>Kontrol Perangkat</CardTitle>
				<CardDescription>
					Pilih mode manual untuk mengontrol perangkat secara langsung.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Pilihan Mode Kontrol */}
				<ToggleGroup
					type="single"
					value={data?.mode || "manual"}
					onValueChange={(value) => {
						if (value) updateControl({ mode: value });
					}}
					className="w-full border"
					disabled={isUpdating}
				>
					<ToggleGroupItem
						value="manual"
						className="w-1/2"
						aria-label="Toggle manual"
					>
						Manual
					</ToggleGroupItem>
					<ToggleGroupItem
						value="auto"
						className="w-1/2"
						aria-label="Toggle otomatis"
					>
						Otomatis
					</ToggleGroupItem>
				</ToggleGroup>

				{/* Kontrol Perangkat (hanya jika mode manual) */}
				<div className="space-y-3">
					{isManualMode ? (
						controls.map(({ id, label, description, Icon, dataKey }) => (
							<div
								key={id}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
										<Icon className="h-6 w-6" />
									</div>
									<div>
										<Label htmlFor={id} className="font-medium">
											{label}
										</Label>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											{description}
										</p>
									</div>
								</div>
								<Switch
									id={id}
									checked={(data?.[dataKey] as boolean) ?? false}
									onCheckedChange={(isChecked) =>
										updateControl({ [dataKey]: isChecked })
									}
									disabled={isUpdating}
								/>
							</div>
						))
					) : (
						<div className="rounded-lg border-2 border-dashed p-6 text-center">
							<p className="text-sm text-neutral-500 dark:text-neutral-400">
								Mode Otomatis Aktif.
								<br />
								Perangkat dikontrol oleh sistem berdasarkan sensor.
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default Kontrol;
