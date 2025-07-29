import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextResponse } from "next/server";

export interface ControlData {
	fan: boolean;
	mode: string;
	pump: boolean;
}

export async function GET() {
	try {
		const rootRef = ref(db, "/control");
		const snapshot = await get(rootRef);
		if (!snapshot.exists()) {
			return NextResponse.json({ error: "No data found" }, { status: 404 });
		}
		const data: ControlData = snapshot.val();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Firebase read error:", error);
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
