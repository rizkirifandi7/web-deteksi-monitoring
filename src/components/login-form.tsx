// src/components/login-form.tsx

"use client"; // Diperlukan untuk hook seperti useState dan useLogin

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-login"; // Impor hook Anda
import { Loader2 } from "lucide-react"; // Ikon untuk loading

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading, error } = useLogin();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		await login(email, password);
	};

	return (
		<div className={cn("flex flex-col gap-4", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="p-0">
					<form onSubmit={handleLogin} className="p-6 md:p-8">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-xl font-bold">Smart Home Safety</h1>
								<p className="text-sm text-muted-foreground">
									Masukkan kredensial Anda untuk masuk ke sistem.
								</p>
							</div>

							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
								/>
							</div>

							<div className="grid gap-3">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="*********"
									
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
								/>
							</div>

							{/* Tampilkan pesan error jika ada */}
							{error && (
								<p className="text-sm font-medium text-destructive">{error}</p>
							)}

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Login"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
