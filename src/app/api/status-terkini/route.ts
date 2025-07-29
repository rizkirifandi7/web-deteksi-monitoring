import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextResponse } from "next/server";

interface DataSensor {
	gas_ppm: number;
	status_api: string;
}

interface StatusAktuator {
	alarm_aktif: boolean;
	kipas_aktif: boolean;
	pompa_aktif: boolean;
}

interface StatusTerkini {
	data_sensor: DataSensor;
	status_aktuator: StatusAktuator;
	status_sistem: string;
	update_terakhir: number;
}

export async function GET() {
	try {
		const statusRef = ref(db, "/status_terkini");
		const snapshot = await get(statusRef);

		if (!snapshot.exists()) {
			return NextResponse.json(
				{ error: "Data 'status_terkini' tidak ditemukan." },
				{ status: 404 }
			);
		}

		const data: StatusTerkini = snapshot.val();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Firebase read error:", error); 
		const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
