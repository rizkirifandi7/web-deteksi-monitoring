"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import useKontrol from "@/hooks/use-kontrol";
import Kontrol from "@/components/kontrol";

const KontrolPage = () => {
	const { data, isLoading, error, updateControl, isUpdating } = useKontrol();

	// Loading state
	if (isLoading && !data) {
		return <Card className="p-4 mt-2">Loading...</Card>;
	}

	// Error state
	if (error) {
		return <Card className="p-4 mt-2 text-red-500">{error}</Card>;
	}

	return (
		<Kontrol
			data={data}
			updateControl={updateControl}
			isUpdating={isUpdating}
		/>
	);
};

export default KontrolPage;
