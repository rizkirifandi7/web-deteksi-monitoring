// components/AuthGuard.tsx

"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Halaman publik yang bisa diakses tanpa login
const publicRoutes = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Jangan lakukan apa-apa selagi masih loading
		if (isLoading) {
			return;
		}

		const isPublicPath = publicRoutes.includes(pathname);

		// Jika pengguna tidak login dan mencoba akses halaman terproteksi
		if (!user && !isPublicPath) {
			router.push("/login");
		}

		// Jika pengguna sudah login dan mencoba akses halaman login
		if (user && isPublicPath) {
			router.push("/dashboard/sensor"); // Arahkan ke dashboard
		}
	}, [user, isLoading, pathname, router]);

	// Tampilkan loading screen saat memeriksa status auth
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}

	// Jika sudah login, atau berada di halaman publik, tampilkan kontennya.
	// Ini mencegah kilatan halaman yang dilindungi sebelum redirect.
	if (!user && !publicRoutes.includes(pathname)) {
		return null; // atau return loading screen
	}

	if (user && publicRoutes.includes(pathname)) {
		return null; // atau return loading screen
	}

	return <>{children}</>;
}
