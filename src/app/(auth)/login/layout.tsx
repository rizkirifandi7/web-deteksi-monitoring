import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Login | Smart Home Safety",
	description: "Halaman Login Smart Home Safety",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return <div>{children}</div>;
};

export default AuthLayout;
