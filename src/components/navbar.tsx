"use client";

import { History, House, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card } from "./ui/card";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Gagal untuk logout:", error);
        }
    };

    return (
        <div className="py-4">
            <Card className="grid grid-cols-3 items-center justify-center w-full text-center text-sm font-medium shadow-none rounded-md py-0">
                <Link
                    href={"/dashboard/sensor"}
                    className={`py-5 flex flex-col justify-center items-center text-xs md:text-sm ${
                        pathname == "/dashboard/sensor"
                            ? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
                            : ""
                    }`}
                >
                    <House size={20} />
                    Sensor
                </Link>
                <Link
                    href={"/dashboard/histori"}
                    className={`py-5 flex flex-col justify-center items-center text-xs md:text-sm ${
                        pathname == "/dashboard/histori"
                            ? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
                            : ""
                    }`}
                >
                    <History size={20} />
                    Histori
                </Link>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className={`py-5 flex flex-col justify-center items-center text-xs cursor-pointer md:text-sm  dark:hover:bg-red-950/50 rounded-r-md transition-colors ${
                                pathname == "/dashboard/logout"
                                    ? "bg-neutral-100 dark:bg-neutral-800 rounded-md"
                                    : ""
                            }`}
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin keluar dari aplikasi?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini akan mengeluarkan Anda dari sesi saat ini. Anda
                                perlu masuk kembali untuk melanjutkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout} className="bg-emerald-500">Logout</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
    );
};

export default Navbar;