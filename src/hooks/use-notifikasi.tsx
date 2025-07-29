"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	Dispatch,
	SetStateAction,
} from "react";

// 1. Definisikan tipe untuk data notifikasi yang mungkin ingin Anda tampilkan di UI
interface NotificationPayload {
	title: string;
	message: string;
	link?: string;
}

// 2. Definisikan tipe untuk nilai yang akan disediakan oleh Context
interface NotificationContextType {
	notification: NotificationPayload | null;
	setNotification: Dispatch<SetStateAction<NotificationPayload | null>>;
	sendNotification: (
		token: string,
		title: string,
		message: string,
		link?: string
	) => Promise<void>;
}

// 3. Berikan nilai default yang sesuai dengan tipe saat membuat context
const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

// 4. Definisikan tipe untuk props Provider
interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider = ({
	children,
}: NotificationProviderProps) => {
	// 5. Beri tipe pada state useState
	const [notification, setNotification] = useState<NotificationPayload | null>(
		null
	);

	// 6. Beri tipe pada parameter fungsi
	const sendNotification = async (
		token: string,
		title: string,
		message: string,
		link?: string
	): Promise<void> => {
		if (!token) {
			console.error("Token notifikasi tidak tersedia");
			return;
		}

		try {
			const response = await fetch("/api/send-notifikasi", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					title,
					message,
					link: link || "/dashboard",
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Notifikasi terkirim:", data);
			// Fungsi ini tidak perlu mengembalikan data, jadi Promise<void> sudah cukup
		} catch (error) {
			console.error("Gagal mengirim notifikasi:", error);
			// Melempar error lagi agar bisa ditangani di tempat pemanggilan jika perlu
			throw error;
		}
	};

	return (
		<NotificationContext.Provider
			value={{ sendNotification, notification, setNotification }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifikasi = (): NotificationContextType => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error("useNotifikasi must be used within a NotificationProvider");
	}
	return context;
};
