//columns.tsx (client component) will contain our column definitions.
"use client";

import { Demandes } from "@/data/demande";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const columns: ColumnDef<Demandes>[] = [


  {
    accessorKey: "codeDemande",
    header: "رقم الطلب",
    footer: "رقم الطلب",
  },
  {
    accessorKey: "nomAssociation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم الجمعية
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    footer: "اسم الجمعية",
  },
  {
    accessorKey: "deleguation.nom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المندوبية
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    footer: "المندوبية",
  },
  {
    accessorKey: "dateDemande",
    header: "تاريخ الطلب",
    footer: "تاريخ الطلب",
  },
  {
    accessorKey: "etat",
    cell(props) {
      const demande = props.row.original;
      return (
        <span
          className={
            demande.etat === "قيد العمل"
              ? "bg-yellow-200 p-2 rounded-lg"
              : demande.etat === "موافق عليه"
                ? "bg-green-200 p-2 rounded-lg"
                : "bg-red-200 p-2 rounded-lg"
          }
        >
          {demande.etat}
        </span>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          حالة الطلب
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    footer: "حالة الطلب",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const demande = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link
              href={demande.codeDemande ? `/subvention/${demande.codeDemande}` : `#`}
            >
              <DropdownMenuItem>تحديث</DropdownMenuItem>
            </Link>
            <DropdownMenuItem >حذف الطلب</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    footer: "الإجراءات",
  },
];
