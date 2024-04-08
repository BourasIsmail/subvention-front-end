"use client";

import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { FaGenderless } from "react-icons/fa";
import { BsEnvelopePaperFill } from "react-icons/bs";
import { RiMailForbidFill } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import {
  getAllCoordination,
  getAllDeleguation,
  getDashboard,
} from "@/api/demande";
import PieChartBenef from "@/components/PieChart";
import { Icons } from "@/components/icons";

export default function DashboardPage() {
  const [selectedValue, setselectedValue] = useState("");
  const [selectedChoice, setselectedChoice] = useState("");
  const { data: coordination } = useQuery({
    queryKey: ["coordination"],
    queryFn: () => getAllCoordination(), // Remove the unnecessary argument from the function call
  });

  const { data: deleguation } = useQuery({
    queryKey: ["deleguation"],
    queryFn: () => getAllDeleguation(), // Remove the unnecessary argument from the function call
  });

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard", selectedChoice],
    queryFn: () =>
      getDashboard(
        selectedValue === "Coordination" ? undefined : selectedChoice,
        selectedValue === "Deleguation" ? undefined : selectedChoice
      ),
  });

  console.log(dashboard);
  if (isLoading)
    return (
      <div className="flex justify-center align-baseline pt-14">
        <Icons.spinner className=" h-60 w-60 animate-spin" />
      </div>
    );

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="mr-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">لوحة القيادة</h2>
            <div className="flex items-center gap-2 space-x-2">
              {/** deleguation coordination filter*/}
              <Select onValueChange={setselectedValue}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="البحث بواسطة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الخيارات</SelectLabel>
                    <SelectItem value="Coordination">المنسقية</SelectItem>
                    <SelectItem value="Deleguation">المندوبية</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select onValueChange={setselectedChoice}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="البحث بواسطة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الخيارات</SelectLabel>
                    {selectedValue === "Coordination"
                      ? coordination?.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item?.id?.toString() ?? ""}
                          >
                            {item.nom}
                          </SelectItem>
                        ))
                      : selectedValue === "Deleguation"
                      ? deleguation?.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item?.id?.toString() ?? ""}
                          >
                            {item.nom}
                          </SelectItem>
                        ))
                      : null}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button>تحميل الصفحة</Button>
            </div>
          </div>
          <Tabs dir="rtl" defaultValue="demande" className="space-y-4 right-0">
            <TabsList>
              <TabsTrigger className="text-lg text-bold" value="demande">
                الطلبات
              </TabsTrigger>
              <TabsTrigger className="text-lg text-bold" value="association">
                الجمعيات
              </TabsTrigger>
              <TabsTrigger className="text-lg text-bold" value="etablissement">
                المؤسسات
              </TabsTrigger>
              <TabsTrigger className="text-lg text-bold" value="benef">
                المستفيدين
              </TabsTrigger>
            </TabsList>
            <TabsContent value="demande" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      عدد الطلبات الإجمالي
                    </CardTitle>
                    <BsEnvelopePaperFill />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.totalDemandes}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      الطلبات تحت الإجراء
                    </CardTitle>
                    <MdOutlinePendingActions />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.demandesEnCours}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      الطلبات الموافق عليها
                    </CardTitle>
                    <GiConfirmed />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.demandesAcceptees}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      الطلبات المرفوضة
                    </CardTitle>
                    <RiMailForbidFill />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.demandesRefusees}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>حالة الطلبات</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={[
                        "demandesEnCours",
                        "demandesAcceptees",
                        "demandesRefusees",
                      ]}
                      dataSet={[
                        dashboard?.demandesEnCours || 0,
                        dashboard?.demandesAcceptees || 0,
                        dashboard?.demandesRefusees || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>statistique</CardTitle>
                    <CardDescription>
                      description de statistique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{/* statistique */}</CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="association" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>
                      الجمعيات حسب الجمعيات حسب طبيعة البيئة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={["demandesUrbaines", "demandesRurales"]}
                      dataSet={[
                        dashboard?.demandesUrbaines || 0,
                        dashboard?.demandesRurales || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>
                      التوزيع النسبي للمستفيدات و للمستفيدين
                    </CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={[
                        "المستفيدات في المجال القروي",
                        "المستفيدات في المجال الحظري",
                        "المستفيدين في المجال القروي",
                        "المستفيدين في المجال الحظري",
                      ]}
                      dataSet={[
                        dashboard?.beneficaireFemmeRural || 0,
                        dashboard?.beneficaireFemmeUrbain || 0,
                        dashboard?.beneficaireHommeRural || 0,
                        dashboard?.beneficaireHommeUrbain || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="etablissement" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      عدد المستخدمين الإجمالي
                    </CardTitle>
                    <BsEnvelopePaperFill />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.totalAgents}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      المستخدمين
                    </CardTitle>
                    <IoMdMale />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.agentsHommes}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      المستخدمات
                    </CardTitle>
                    <IoMdFemale />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.demandesAcceptees}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>التوزيع النسبي للمستخدمات للمستخدمين</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={["المستخدمين", "المستخدمات"]}
                      dataSet={[
                        dashboard?.agentsHommes || 0,
                        dashboard?.agentsFemmes || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>
                      التوزيع النسبي للمستفيدات و للمستفيدين
                    </CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={[
                        "المستفيدات في المجال القروي",
                        "المستفيدات في المجال الحظري",
                        "المستفيدين في المجال القروي",
                        "المستفيدين في المجال الحظري",
                      ]}
                      dataSet={[
                        dashboard?.beneficaireFemmeRural || 0,
                        dashboard?.beneficaireFemmeUrbain || 0,
                        dashboard?.beneficaireHommeRural || 0,
                        dashboard?.beneficaireHommeUrbain || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="benef" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      عدد المستفيدين من جميع الخدمات
                    </CardTitle>
                    <BsEnvelopePaperFill />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.beneficiaireTousService}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      عدد المستفيدين من الخدمة النهارية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.beneficiaireServiceMatinal}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      عدد المستفيدين من الخدمة الجزئية
                    </CardTitle>
                    <GiConfirmed />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.beneficiaireServicePartiel}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">
                      عدد المستفيدين من الخدمة الكلية
                    </CardTitle>
                    <RiMailForbidFill />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboard?.beneficiaireServiceTotal}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>المستفيدين حسب نوع الخدمة</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={[
                        "beneficiaireServiceMatinal",
                        "beneficiaireServicePartiel",
                        "beneficiaireServiceTotal",
                      ]}
                      dataSet={[
                        dashboard?.beneficiaireServiceMatinal || 0,
                        dashboard?.beneficiaireServicePartiel || 0,
                        dashboard?.beneficiaireServiceTotal || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>التوزيع النسبي للإناث والذكور</CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChartBenef
                      colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                      labels={["المستفيدين", "المستفيدات"]}
                      dataSet={[
                        dashboard?.beneficiairesHommes || 0,
                        dashboard?.beneficiairesFemmes || 0,
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
