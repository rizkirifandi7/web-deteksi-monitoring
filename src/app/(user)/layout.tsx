"use client"; // 1. Wajib dijadikan Client Component karena menggunakan hooks

import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ThemeToggle from "@/components/theme-button";
import AuthGuard from "@/components/auth-guard";
import useStatusData from "@/hooks/use-status-data";
import useFcmToken from "@/hooks/use-fcm-token";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	// --- BLOK LOGIKA NOTIFIKASI DIMULAI DI SINI ---
	const { data: statusData } = useStatusData();
	const { token: fcmToken } = useFcmToken();

	// State untuk mencegah notifikasi dikirim berulang kali
	const [gasNotifSent, setGasNotifSent] = useState(false);
	const [apiNotifSent, setApiNotifSent] = useState(false);

	useEffect(() => {
		// Pastikan data dan token sudah siap
		if (!statusData || !fcmToken) return;

		const { data_sensor } = statusData;
		const DANGER_LEVEL_GAS = 200; // Sesuaikan ambang batas bahaya gas

		// Logika untuk Notifikasi Gas
		if (data_sensor.gas_ppm >= DANGER_LEVEL_GAS) {
			if (!gasNotifSent) {
				console.log("Mengirim notifikasi bahaya gas...");
				fetch("/api/send-notifikasi", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						token: fcmToken,
						title: "🚨 Bahaya Gas Terdeteksi!",
						message: `Level gas mencapai ${data_sensor.gas_ppm} PPM.`,
						link: "/dashboard/sensor",
					}),
				});
				setGasNotifSent(true);
			}
		} else if (gasNotifSent) {
			// Reset status jika kondisi kembali aman
			setGasNotifSent(false);
		}

		// Logika untuk Notifikasi Api
		if (data_sensor.status_api === "Terdeteksi") {
			if (!apiNotifSent) {
				console.log("Mengirim notifikasi peringatan api...");
				fetch("/api/send-notifikasi", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						token: fcmToken,
						title: "🔥 PERINGATAN KEBAKARAN!",
						message: "Sistem mendeteksi adanya api. Segera ambil tindakan!",
						link: "/dashboard/sensor",
					}),
				});
				setApiNotifSent(true);
			}
		} else if (apiNotifSent) {
			// Reset status jika kondisi kembali aman
			setApiNotifSent(false);
		}
	}, [statusData, fcmToken, gasNotifSent, apiNotifSent]);
	// --- BLOK LOGIKA NOTIFIKASI SELESAI ---

	return (
		<AuthGuard>
			<div className="flex h-screen flex-col items-center justify-center border-x bg-muted ">
				<div className="h-full w-full max-w-sm overflow-auto border-x bg-white px-4 dark:bg-black md:max-w-lg md:px-6">
					<div className="flex flex-col items-center justify-center gap-y-2 pt-8 pb-4">
						<h1 className="dark:text-white' uppercase text-2xl font-bold">
							Smart Home Safety
						</h1>
						<p className="text-base text-neutral-500 dark:text-neutral-400">
							Monitoring Kebocoran Gas dan Kebakaran
						</p>
						<ThemeToggle />
					</div>
					<Navbar />
					{children}
					<Footer />
				</div>
			</div>
		</AuthGuard>
	);
};

export default DashboardLayout;
