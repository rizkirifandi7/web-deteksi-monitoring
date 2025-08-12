"use client";

import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { DataTableRiwayat } from "@/components/table-histori";
import useLogKejadian from "@/hooks/use-histori";

const HistoriPage = () => {
	const { data, isLoading, error } = useLogKejadian();

	if (isLoading && !data) return <p>Memuat data histori...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<Card className="rounded-md border shadow-none mt-2">
			<CardHeader className="text-center border-b">
				<CardTitle>Histori Kejadian</CardTitle>
				<CardDescription>
					Daftar kejadian yang tercatat oleh sistem keamanan.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4">
				<DataTableRiwayat data={data || []} />
			</CardContent>
		</Card>
	);
};

export default HistoriPage;
