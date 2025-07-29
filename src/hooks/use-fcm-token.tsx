"use client";

import { useEffect, useRef, useState } from "react";
import { onMessage, MessagePayload } from "firebase/messaging"; // 1. Impor tipe MessagePayload
import { fetchToken, messaging } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getNotificationPermissionAndToken(): Promise<
	string | null | undefined
> {
	if (!("Notification" in window)) {
		console.info("Browser ini tidak mendukung notifikasi desktop");
		return null;
	}

	if (Notification.permission === "granted") {
		return await fetchToken();
	}

	if (Notification.permission !== "denied") {
		const permission = await Notification.requestPermission();
		if (permission === "granted") {
			return await fetchToken();
		}
	}

	// Jika kode sampai di sini, berarti izin tidak didapatkan.
	console.log("Izin notifikasi tidak diberikan.");
	return null;
}

const useFcmToken = () => {
	const router = useRouter();
	// 2. Beri tipe pada state dan ref
	const [notificationPermissionStatus, setNotificationPermissionStatus] =
		useState<NotificationPermission | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const retryLoadToken = useRef<number>(0);
	const isLoading = useRef<boolean>(false);

	useEffect(() => {
		const loadToken = async () => {
			if (isLoading.current) return;

			isLoading.current = true;
			const fcmToken = await getNotificationPermissionAndToken();

			if (Notification.permission === "denied") {
				setNotificationPermissionStatus("denied");
				isLoading.current = false;
				return;
			}

			if (!fcmToken) {
				if (retryLoadToken.current >= 3) {
					console.error("Gagal memuat token setelah 3x percobaan.");
					isLoading.current = false;
					return;
				}
				retryLoadToken.current += 1;
				isLoading.current = false;
				// Panggil kembali dengan sedikit jeda
				setTimeout(loadToken, 1000 * retryLoadToken.current);
				return;
			}

			setNotificationPermissionStatus(Notification.permission);
			setToken(fcmToken);
			isLoading.current = false;
		};

		if ("Notification" in window) {
			loadToken();
		}
	}, []); // Dijalankan sekali saat komponen mount

	useEffect(() => {
		// Tipe untuk fungsi unsubscribe dari onMessage
		let unsubscribe: (() => void) | null = null;

		const setupListener = async () => {
			if (!token) return;

			const m = await messaging();
			if (!m) return;

			// Register a listener for incoming FCM messages.
			unsubscribe = onMessage(m, (payload: MessagePayload) => {
				// 3. Tipe untuk payload
				console.log("Notifikasi foreground diterima:", payload);
				if (Notification.permission !== "granted") return;

				const title = payload.notification?.title || "Notifikasi Baru";
				const body = payload.notification?.body || "";
				const link = payload.fcmOptions?.link || payload.data?.link;

				// Tampilkan notifikasi menggunakan toast (sonner)
				toast.info(`${title}: ${body}`, {
					action: link
						? {
								label: "Kunjungi",
								onClick: () => router.push(link),
						  }
						: undefined,
				});

				// Uncomment baris di bawah jika Anda juga ingin menampilkan notifikasi asli dari browser

				const notification = new Notification(title, {
					body,
					data: link ? { url: link } : undefined,
				});

				notification.onclick = (event: Event) => {
					event.preventDefault();
					// 4. Penanganan event klik yang type-safe
					const target = event.target as Notification;
					const url = target?.data?.url;
					if (url) {
						router.push(url);
					}
				};
			});
		};

		setupListener();

		// Cleanup the listener when the component unmounts or token changes.
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [token, router]);

	return { token, notificationPermissionStatus };
};

export default useFcmToken;
