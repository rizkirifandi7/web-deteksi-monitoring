// components/data-table.tsx (atau nama file yang sesuai)

"use client";

import * as React from "react";
import {
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	flexRender,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { DataTableRiwayatProps, LogKejadian } from "@/types/types";

// Definisikan kolom untuk data LogKejadian
export const columns: ColumnDef<LogKejadian>[] = [
	{
		accessorKey: "timestamp",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Waktu Kejadian
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const timestamp = row.getValue("timestamp") as number;
			// Format timestamp menjadi tanggal dan waktu yang mudah dibaca
			const formattedDate = new Date(timestamp).toLocaleString("id-ID", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
			return <div className="font-medium">{formattedDate}</div>;
		},
	},
	{
		accessorKey: "jenis_ancaman",
		header: "Jenis Ancaman",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("jenis_ancaman")}</div>
		),
	},

	{
		accessorKey: "level",
		header: "Level",
		cell: ({ row }) => {
			const level = row.getValue("level") as string;
			const variant: "destructive" | "default" =
				level === "Bahaya" ? "destructive" : "default";
			const className = level === "Siaga" ? "bg-amber-500" : "";

			return (
				<Badge variant={variant} className={className}>
					{level}
				</Badge>
			);
		},
	},
	{
		accessorKey: "alarm_aktif",
		header: "Alarm",
		cell: ({ row }) => (
			<div className="capitalize">
				{row.getValue("alarm_aktif") === true ? "Aktif" : "Mati"}
			</div>
		),
	},
	{
		accessorKey: "kipas_aktif",
		header: "Kipas",
		cell: ({ row }) => (
			<div className="capitalize">
				{row.getValue("kipas_aktif") === true ? "Aktif" : "Mati"}
			</div>
		),
	},
	{
		accessorKey: "pompa_aktif",
		header: "Pompa",
		cell: ({ row }) => (
			<div className="capitalize">
				{row.getValue("pompa_aktif") === true ? "Aktif" : "Mati"}
			</div>
		),
	},
];

export function DataTableRiwayat({ data }: DataTableRiwayatProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
