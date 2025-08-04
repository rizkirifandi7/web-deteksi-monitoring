"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ThemeToggle from "@/components/theme-button";
import AuthGuard from "@/components/auth-guard";
import useFcmToken from "@/hooks/use-fcm-token";
import useStatusData from "@/hooks/use-data-terkini";
import useNotificationTrigger from "@/hooks/use-notifikasi-trigger";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const { data: statusData } = useStatusData();
	const { token: fcmToken } = useFcmToken();

	useNotificationTrigger({ statusData, fcmToken });

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
