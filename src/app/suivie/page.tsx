"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MdOutlinePendingActions } from "react-icons/md";
import { use, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { useQuery } from "react-query";
import { getDemandeByCode } from "@/api/demande";

export default function Home() {
    const params = useSearchParams();
    const code = params.get("code");
    const { data: demande } = useQuery({
        queryKey: ["demande", code],
        queryFn: () => getDemandeByCode(code || ""),
        enabled: !!code,
    });
    const router = useRouter();
    const [search, setsearch] = useState("");
    const handleSearch = () => {
        if (search === "") {
            router.push(`/suivie`);
        }
        router.push(`/suivie?code=${search}`);
    };

    return (
        <>
            <Navbar />
            <MaxWidthWrapper>
                <div className="flex min-h-full justify-center px-6 py-24 lg:px-8">
                    <div className="flex w-full max-w-sm items-center gap-3 space-x-2">
                        <Input
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                            type="text"
                            placeholder="رقم الطلب"
                        />
                        <Button onClick={handleSearch} type="button">
                            ابحث
                        </Button>
                    </div>
                </div>

                {demande && ( // Check if demande is not null
                    <div className="w-full m-auto p-4 border rounded-lg bg-gray-100 overflow-y-auto">
                        <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
                            <span>رقم الطلب</span>
                            <span className="sm:text-right text-left">حالة الطلب</span>
                            <span className="hidden md:grid">تاريخ الطلب</span>
                            <span className="hidden sm:grid">اسم الجمعية</span>
                        </div>
                        <ul>
                            <li className="bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
                                <div className="flex gap-1">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <MdOutlinePendingActions
                                            className="text-blue-800"
                                            size={20}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-800 font-bold">
                                            {demande.codeDemande}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 sm:text-right text-left">
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
                                </p>
                                <p className="hidden md:flex">{demande.dateDemande}</p>
                                <p className="sm:flex hidden">{demande.nomAssociation}</p>
                            </li>
                        </ul>
                    </div>
                )}
                {!demande && (
                    <div className="w-full m-auto p-4 border rounded-lg bg-gray-100 overflow-y-auto">
                        <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
                            <p className="flex items-center">رقم الطلب غير صحيح أو مفقود</p>
                        </div>
                    </div>
                )}
            </MaxWidthWrapper>
        </>
    );
}
