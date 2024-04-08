//columns.tsx (client component) will contain our column definitions.
"use client";

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
import { UserInfo } from "@/api/User";
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
import { useQueryClient } from "react-query";
import { useState } from "react";
import { api } from "@/api";

export const columns: ColumnDef<UserInfo>[] = [
  {
    accessorKey: "name",
    header: "الإسم",
    footer: "الإسم",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          البريد الإلكتروني
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    footer: "البريد الإلكتروني",
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
    accessorKey: "roles",
    header: "الأدوار",
    footer: "الأدوار",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const queryClient = useQueryClient();
      const deleteUser = async () => {
        const res = await api.delete(`/auth/${user.id}`);
        queryClient.invalidateQueries("AllUsers");
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
              <Link href={user.id ? `/users/${user.id}` : `#`}>
                <DropdownMenuItem>تحديث</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => setopen(true)}>
                حذف الطلب
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
                    هذا الإجراء لا يمكن التراجع عنه. سيتم حذف هذا الحساب بشكل
                    دائم وإزالة البيانات الخاصة بك من خوادمنا.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-8">
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteUser}>
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
