import { ColumnDef } from "@tanstack/react-table";
import { Demandes } from "@/data/demande";
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { api } from "@/api";
import { useQueryClient } from "react-query";

export const columnsC: ColumnDef<Demandes>[] = [
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
    accessorKey: "dateSuppression",
    header: "تاريخ حذف الطلب",
    cell(props) {
      const demande = props.row.original;
      const dateDemande = demande.dateSuppression
        ? new Date(demande.dateSuppression)
        : null;
      return dateDemande ? dateDemande.toLocaleDateString("ar-MA") : "";
    },
    footer: "تاريخ حذف الطلب",
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

      const queryClient = useQueryClient();

      const restaurerDemande = async () => {
        const res = await api.put(`/demande/restaurer/${demande.id}`);
        queryClient.invalidateQueries("AllDemandes");
        queryClient.invalidateQueries("DemandesSupprime");
      };

      const [open, setopen] = useState(false);

      return (
        <>
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
                href={
                  demande.codeDemande
                    ? `/subvention/${demande.codeDemande}`
                    : `#`
                }
              >
                <DropdownMenuItem>تحديث</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => setopen(true)}>
                إسترجاع الطلب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <AlertDialog open={open} onOpenChange={setopen}>
              <AlertDialogTrigger asChild></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    هذا الإجراء لا يمكن التراجع عنه. سيتم إسترجاع هذا الطلب.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-8">
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={restaurerDemande}>
                    متابعة
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      );
    },
    footer: "الإجراءات",
  },
];
