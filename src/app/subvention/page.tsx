"use client";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { useQuery } from "react-query";
import { Demande, getAllDemandes, getDemandeByDeleguationId } from "@/api/demande";
import { getCurrentUser } from "@/api";
import { UserInfo } from "@/api/User";
import { useState } from "react";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button";



export default function Home() {
  const [user, setUser] = useState<UserInfo>();

  useQuery("currentUser", getCurrentUser(), {
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const { data: demandes } = useQuery({
    queryKey: ["AllDemandes"],
    queryFn: getAllDemandes,
  });

  const { data: demandesByDeleguation } = useQuery(
    ["DemandesByDeleguation", user?.deleguation?.id ?? 0],
    () => getDemandeByDeleguationId(user?.deleguation?.id ?? 0),
    {
      enabled: !!user?.deleguation?.id,
    }
  );



  const dataTable = user?.deleguation !== null ? demandesByDeleguation : demandes;
  console.log(dataTable);

  const exportToExcel = () => {
    const data = dataTable?.map((item: Demande) => {
      return {
        "رقم الطلب": item.codeDemande,
        "اسم الجمعية": item.nomAssociation,
        "العنوان": item.addresse,
        "رقم الحساب البنكي": item.rib,
        "اسم الرئيس": item.nomPresident,
        "هاتف الرئيس": item.telephonePresident,
        "بريد الكتروني للرئيس": item.emailPresident,
        "المنسقية": item.deleguation.coordination.nom,
        "المندوبية": item.deleguation.nom,
        "المجال": item.typeMilieu,
        "اسم المؤسسة": item.nomEtablissement,
        "اسم المدير": item.nomDirecteur,
        "هاتف المدير": item.telDirecteur,
        "بريد الكتروني للمدير": item.emailDirecteur,
        "رقم الرخصة": item.numAutorisation,
        "مجموع الطاقة الإستعابية المرخصة": item.capaciteChargeTotal,
        "عدد المستفيدات": item.nbrBeneficiairesFemmes,
        "عدد المستفيدين": item.nbrBeneficiairesHommes,
        "عدد المستفيدين الإجمالي": item.nbrTotalBeneficiaires,
        "عدد المستخدمات": item.nbrAgentsFemmes,
        "عدد المستخدمين": item.nbrAgentsHommes,
        "عدد المستخدمين الإجمالي": item.nbrTotalAgents,
        "عدد المستفيدين من الخدمات النهارية": item.nbrBeneficiairesServiceMatinal,
        "عدد المستفيدين من الخدمات الجزئية": item.nbrBeneficiairesServicePartiel,
        "عدد المستفيدين من الخدمات الكلية": item.nbrBeneficiairesServiceTotal,
        "تاريخ ٱخر جمع عام لتجديد المسير": item.dateCollecte,
        "مدة صلاحية المكتب": item.dureeValidite,
        "مجموع المصاريف عن السنة الفارطة": item.recetteTotalAnneePrecedente,
        "مجموع المداخيل عن السنة الفارطة": item.revenuTotalAnneePrecedente,
        "تاريخ الطلب": item.dateDemande,
        "موضوع الطلب": item.sujetDemande
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data || []);



    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(blob, "data.xlsx");
  };



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
        <Button onClick={exportToExcel}>Download Excel</Button>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={dataTable || []} />

        </div>
      </main>
    </>
  );
}
