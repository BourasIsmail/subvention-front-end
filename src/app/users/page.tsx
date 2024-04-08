"use client";
import DataTable from "./data-table";
import { useQuery } from "react-query";
import {
  Demande,
  getAllDemandes,
  getDemandeByDeleguationId,
} from "@/api/demande";
import { getCurrentUser, getUsers } from "@/api";
import { UserInfo } from "@/api/User";
import { useState } from "react";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<UserInfo>();

  useQuery("currentUser", getCurrentUser(), {
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const { data: users } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: getUsers(),
  });

  console.log(users);

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="mr-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <main className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-10">
          <Link href="/users/addUser">
            <Button className="float-end">إضافة حساب</Button>
          </Link>
          <DataTable columns={columns} data={users || []} />
        </div>
      </main>
    </>
  );
}
