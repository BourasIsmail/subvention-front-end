"use client";

import { getDemandeById } from "@/api/demande";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import generatePDF from "react-to-pdf";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Navbar from "@/components/navbar";
import { TakeScreentShot } from "@/lib/utils";
import { Suspense } from "react";

export default function Home() {
  const params = useSearchParams();

  const id = params.get("code");

  const { data: demande } = useQuery({
    queryKey: ["demande", id],
    queryFn: () => getDemandeById(Number(id) || 0),
    enabled: !!id,
  });

  const getImage = () => {
    TakeScreentShot("ref", "رقم الطلب", "image/png");
  };
  return (
    <>
      <Navbar></Navbar>
      <div>
        <MaxWidthWrapper className="pt-14">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <Card
              dir="rtl"
              className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center flex-col gap-4 border  shadow-2xl"
            >
              <CardHeader>
                <CardTitle>هذا الرمز ضروري لتتبع طلبك</CardTitle>
              </CardHeader>
              <CardContent id="ref">
                <p className="text-lg font-bold">رقم الطلب :</p>
                <p className="text-lg font-bold">{demande?.codeDemande}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <p>في حالة فقدان هذا الرمز، يرجى الاتصال بوكالتك</p>
                <div className="flex flex-row gap-4">
                  <Link href={"/suivie"}>
                    <Button variant="default">تتبع طلبك</Button>
                  </Link>
                  <Button onClick={getImage}>حفظ كصورة</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
