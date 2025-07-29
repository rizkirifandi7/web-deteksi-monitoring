// pages/HistoriPage.tsx

"use client";

import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { DataTableRiwayat } from "@/components/table-histori"; // Sesuaikan path jika perlu // Gunakan hook yang baru
import useLogKejadian from "@/hooks/use-histori";

const HistoriPage = () => {
	const { data, isLoading, error } = useLogKejadian();

	// Tampilkan pesan loading atau error
	if (isLoading && !data) return <p>Memuat data riwayat...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<Card className="rounded-md border shadow-none mt-2">
			<CardHeader className="text-center border-b">
				<CardTitle>Riwayat Kejadian</CardTitle>
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
