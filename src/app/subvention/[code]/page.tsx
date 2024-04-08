"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useState } from "react";

import { Demandes, data } from "@/data/demande";
import {
  Coordination,
  Deleguation,
  Demande,
  getAllCoordination,
  getDeleguationByCoordinationId,
  getDemandeByCode,
} from "@/api/demande";
import { useQuery } from "react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/api";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const page = ({
  params,
}: {
  params: {
    code: string;
  };
}) => {
  const [selectedValue, setselectedValue] = useState<Demandes>()
  const { data: demande, isLoading } = useQuery({
    queryKey: ["demande", params.code],
    queryFn: () => getDemandeByCode(params.code || ""),
    enabled: !!params.code,
    onSuccess: (data) => {
      setselectedValue(data || ({} as Demandes));
    },
  });


  const { data: coordination } = useQuery({
    queryKey: ["coordination"],
    queryFn: () => getAllCoordination(), // Remove the unnecessary argument from the function call
  });

  const { data: deleguation } = useQuery({
    queryKey: ["coordination", selectedValue?.coordination?.id],
    queryFn: () =>
      getDeleguationByCoordinationId(selectedValue?.coordination?.id),
    enabled: !!selectedValue?.coordination?.id, // Remove the unnecessary argument from the function call
  });


  interface Data {
    id?: number;
    nomAssociation?: string;
    deleguation?: Deleguation;
    coordination?: Coordination;
    numAutorisation?: string;
    addresse?: string;
    telephonePresident?: string; // Updated field name
    emailPresident?: string;
    nomPresident?: string;
    nbrBeneficiairesHommes?: number;
    nbrBeneficiairesFemmes?: number;
    nbrAgentsHommes?: number;
    nbrAgentsFemmes?: number;
    sujetDemande?: string;
    nomEtablissement?: string; // Added field
    nomDirecteur?: string | null;
    telDirecteur?: string; // Added field
    emailDirecteur?: string; // Added field
    dateDemande?: string; // Updated field type to match Java entity
    nbrTotalBeneficiaires?: number;
    nbrTotalAgents?: number;
    codeDemande?: string; // Updated field type to match Java entity
    rib?: string;
    capaciteChargeTotal?: string | null; // Updated field type to match Java entity
    nbrBeneficiairesServiceTotal?: number;
    nbrBeneficiairesServiceMatinal?: number;
    nbrBeneficiairesServicePartiel?: number;
    dateCollecte?: string | null;
    dureeValidite?: number;
    revenuTotalAnneePrecedente?: number;
    recetteTotalAnneePrecedente?: number;
    etat?: string;
    typeMilieu?: string | null;
    zipData?: File | null;
    fileName?: string | null;
    fileType?: string | null;
  }


  const handleSubmit = (e: any) => {
    try {
      e.preventDefault();
      console.log(selectedValue);
      const response = api
        .put(`/demande/${selectedValue?.id}`, selectedValue)
        .then((res) => {
          console.log(response);
        });
      toast({
        description: "تم تحديث البيانات بنجاح",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "نجاح",
      });
    } catch (error) {
      toast({
        description: "اسم مستخدم أو كلمة مرور غير صحيحة",
        variant: "destructive",
        duration: 3000,
        title: "خطأ",
      });
    }
  };


  const registerFile = (e: any) => {
    try {
      e.preventDefault();
      console.log(selectedValue);
      const fd = new FormData();
      if (selectedValue?.zipData) {
        fd.append("file", selectedValue.zipData);
      }
      const response = api
        .put(`/demande/upload/${selectedValue?.id}`, fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          console.log(response);
        });
      toast({
        description: "تم تحديث البيانات بنجاح",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "نجاح",
      });
    } catch (error) {
      toast({
        description: "اسم مستخدم أو كلمة مرور غير صحيحة",
        variant: "destructive",
        duration: 3000,
        title: "خطأ",
      });
    }
  };

  if (isLoading) {
    return <progress />;
  }

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
      <MaxWidthWrapper>
        <Tabs dir="rtl" defaultValue="association" className=" pt-8 ">
          <TabsList className="grid w-full grid-cols-4 ">
            <TabsTrigger value="association">الجمعية</TabsTrigger>
            <TabsTrigger value="etablissement">المؤسسة</TabsTrigger>
            <TabsTrigger value="demande">الطلب</TabsTrigger>
            <TabsTrigger value="fichier">المرفقات</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="association">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات حول الجمعية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>اسم الجمعية</Label>
                      <Input type="text" value={selectedValue?.nomAssociation} name="nomAssociation" onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          nomAssociation: e.target.value || "",
                        })
                      } placeholder="اسم الجمعية" />
                    </div>
                    <div>
                      <Label>العنوان</Label>
                      <Input type="text" value={selectedValue?.addresse} name="addresse" onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          addresse: e.target.value || "",
                        })
                      } placeholder="العنوان" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>اسم الرئيس</Label>
                      <Input type="text" value={selectedValue?.nomPresident} name="nomPresident" onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          nomPresident: e.target.value || "",
                        })
                      } placeholder="اسم الرئيس" />
                    </div>
                    <div>
                      <Label>هاتف الرئيس</Label>
                      <Input type="text" value={selectedValue?.telephonePresident} name="telephonePresident" onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          telephonePresident: e.target.value || "",
                        })
                      } placeholder="هاتف الرئيس" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>بريد الكتروني للرئيس</Label>
                      <Input
                        type="text"
                        value={selectedValue?.emailPresident}
                        name="emailPresident"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            emailPresident: e.target.value || "",
                          })
                        }
                        placeholder="بريد الكتروني للرئيس"
                      />
                    </div>
                    <div>
                      <Label>رقم الحساب البنكي</Label>
                      <Input
                        type="text"
                        value={selectedValue?.rib}
                        name="rib"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            rib: e.target.value,
                          })
                        }
                        placeholder="رقم الحساب البنكي"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>تاريخ ٱخر جمع عام لتجديد المسير</Label>
                      <Input
                        type="text"
                        value={selectedValue?.dateCollecte || ""}
                        name="dateCollecte"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            dateCollecte: e.target.value || "",
                          })
                        }
                        placeholder="تاريخ ٱخر جمع عام لتجديد المسير"
                      />
                    </div>
                    <div>
                      <Label>مدة صلاحية المكتب</Label>
                      <Input
                        type="text"
                        value={selectedValue?.dureeValidite}
                        name="dureeValidite"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            dureeValidite: Number(e.target.value),
                          })
                        }
                        placeholder="مدة صلاحية المكتب"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>مجموع المداخيل عن السنة الفارطة</Label>
                      <Input
                        type="text"
                        value={selectedValue?.revenuTotalAnneePrecedente || ""}
                        name="revenuTotalAnneePrecedente"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            revenuTotalAnneePrecedente: Number(e.target.value || ""),
                          })
                        }
                        placeholder="مجموع المداخيل عن السنة الفارطة"
                      />
                    </div>
                    <div>
                      <Label>مجموع المصاريف عن السنة الفارطة</Label>
                      <Input
                        type="text"
                        value={selectedValue?.recetteTotalAnneePrecedente}
                        name="recetteTotalAnneePrecedente"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            recetteTotalAnneePrecedente: Number(e.target.value),
                          })
                        }
                        placeholder="مجموع المصاريف عن السنة الفارطة"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>المنسقية</Label>
                      <Select
                        name="coordination"
                        value={selectedValue?.coordination?.id?.toString() || undefined}
                        onValueChange={
                          (value) => {
                            setselectedValue({
                              ...selectedValue,
                              coordination: coordination?.find((item) => item.id === Number(value)) || undefined,
                            });
                          }
                        }>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="عرض الخيارات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>المنسقيات</SelectLabel>
                            {coordination?.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.nom}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>المندوبية</Label>
                      <Select
                        defaultValue={demande?.deleguation?.id?.toString() || undefined}
                        name="delegation"
                        value={selectedValue?.deleguation?.id?.toString() || undefined}
                        onValueChange={
                          (value) => {
                            setselectedValue({
                              ...selectedValue,
                              deleguation: deleguation?.find((item) => item.id === Number(value)) || undefined,
                            });
                          }
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="عرض الخيارات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>المندوبيات</SelectLabel>
                            {deleguation?.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.nom}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Label>المجال</Label>
                  <Select
                    defaultValue={demande?.typeMilieu ?? ""}
                    value={selectedValue?.typeMilieu ?? ""}
                    name="typeMilieu"
                    onValueChange={
                      (value) => {
                        setselectedValue({
                          ...selectedValue,
                          typeMilieu: value,
                        });
                      }
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="عرض الخيارات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>المجال</SelectLabel>
                        <SelectItem value="حظري">حظري</SelectItem>
                        <SelectItem value="قروي">قروي</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </CardContent>
                <CardFooter>
                  <Button type="submit">حفظ التغييرات</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="etablissement">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات حول المؤسسة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>اسم المؤسسة</Label>
                      <Input type="text" value={selectedValue?.nomEtablissement} name="nomEtablissement" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nomEtablissement: e.target.value || "",
                          })

                      } placeholder="اسم المؤسسة" />
                    </div>
                    <div>
                      <Label>بريد الكتروني للمدير</Label>
                      <Input
                        type="text"
                        value={selectedValue?.emailDirecteur}
                        name="emailDirecteur"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            emailDirecteur: e.target.value || "",
                          })
                        }
                        placeholder="بريد الكتروني للمدير"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>اسم المدير</Label>
                      <Input type="text" value={selectedValue?.nomDirecteur || ""} name="nomDirecteur" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nomDirecteur: e.target.value || "",
                          })
                      } placeholder="اسم المدير" />
                    </div>
                    <div>
                      <Label>هاتف المدير</Label>
                      <Input type="text" value={selectedValue?.telDirecteur} name="telDirecteur" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            telDirecteur: e.target.value || "",
                          })

                      } placeholder="هاتف المدير" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>رقم الرخصة</Label>
                      <Input type="text" value={selectedValue?.numAutorisation} name="numAutorisation" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            numAutorisation: e.target.value || "",
                          })

                      } placeholder="رقم الرخصة" />
                    </div>
                    <div>
                      <Label>مجموع الطاقة الإستعابية المرخصة</Label>
                      <Input
                        type="text"
                        value={selectedValue?.capaciteChargeTotal ?? ""}
                        name="capaciteChargeTotal"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            capaciteChargeTotal: e.target.value || "",
                          })
                        }
                        placeholder="مجموع الطاقة الإستعابية المرخصة"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>عدد المستفيدات</Label>
                      <Input type="text" value={selectedValue?.nbrBeneficiairesFemmes} name="nbrBeneficiairesFemmes" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nbrBeneficiairesFemmes: Number(e.target.value),
                          })
                      } placeholder="عدد المستفيدات" />
                    </div>
                    <div>
                      <Label>عدد المستفيدين</Label>
                      <Input type="text"
                        value={selectedValue?.nbrBeneficiairesHommes}
                        name="nbrBeneficiairesHommes"
                        onChange={
                          (e) =>
                            setselectedValue({
                              ...selectedValue,
                              nbrBeneficiairesHommes: Number(e.target.value),
                            })
                        } placeholder="عدد المستفيدين" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>عدد المستفيدين من الخدمات النهارية</Label>
                      <Input type="text" value={selectedValue?.nbrBeneficiairesServiceMatinal} name="nbrBeneficiairesServiceMatinal" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nbrBeneficiairesServiceMatinal: Number(e.target.value),
                          })
                      } placeholder="عدد المستفيدين من الخدمات النهارية" />
                    </div>
                    <div>
                      <Label>عدد المستفيدين من الخدمات الجزئية</Label>
                      <Input type="text"
                        value={selectedValue?.nbrBeneficiairesServicePartiel}
                        name="nbrBeneficiairesServicePartiel"
                        onChange={
                          (e) =>
                            setselectedValue({
                              ...selectedValue,
                              nbrBeneficiairesServicePartiel: Number(e.target.value),
                            })
                        } placeholder="عدد المستفيدين من الخدمات الجزئية" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>عدد المستفيدين من الخدمات الكلية</Label>
                      <Input type="text" value={selectedValue?.nbrBeneficiairesServiceTotal} name="nbrBeneficiairesServiceTotal" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nbrBeneficiairesServiceTotal: Number(e.target.value),
                          })
                      } placeholder="عدد المستفيدين من الخدمات الكلية" />
                    </div>
                    <div>
                      <Label>عدد المستفيدين الإجمالي</Label>
                      <Input type="text" value={selectedValue?.nbrTotalBeneficiaires} name="nbrTotalBeneficiaires" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nbrTotalBeneficiaires: Number(e.target.value),
                          })
                      } placeholder="عدد المستفيدين الإجمالي" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>عدد المستخدمات</Label>
                      <Input type="text" value={selectedValue?.nbrAgentsFemmes} name="nbrAgentsFemmes" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nbrAgentsFemmes: Number(e.target.value),
                          })
                      } placeholder="عدد المستخدمات" />
                    </div>
                    <div>
                      <Label>عدد المستخدمين</Label>
                      <Input type="text" value={selectedValue?.nbrAgentsHommes} name="nbrAgentsHommes" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            nbrAgentsHommes: Number(e.target.value),
                          })
                      } placeholder="عدد المستخدمين" />
                    </div>
                  </div>
                  <div>
                    <Label>عدد المستخدمين الإجمالي</Label>
                    <Input type="text" value={selectedValue?.nbrTotalAgents} name="nbrTotalAgents" onChange={
                      (e) =>
                        setselectedValue({
                          ...selectedValue,
                          nbrTotalAgents: Number(e.target.value),
                        })
                    } placeholder="عدد المستخدمين الإجمالي" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">حفظ التغييرات</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="demande">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات حول الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label>موضوع الطلب</Label>
                  <Textarea value={selectedValue?.sujetDemande} name="sujetDemande" onChange={
                    (e) =>
                      setselectedValue({
                        ...selectedValue,
                        sujetDemande: e.target.value || "",
                      })

                  } placeholder="موضوع الطلب" />

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label>رقم الطلب</Label>
                      <Input type="text" value={selectedValue?.codeDemande} name="codeDemande" onChange={
                        (e) =>
                          setselectedValue({
                            ...selectedValue,
                            codeDemande: e.target.value,
                          })
                      } placeholder="رقم الطلب" />
                    </div>
                    <div>
                      <Label>حالة الطلب</Label>
                      <Select
                        defaultValue={demande?.etat ?? ""}
                        value={selectedValue?.etat ?? ""}
                        name="etat"
                        onValueChange={
                          (value) => {
                            setselectedValue({
                              ...selectedValue,
                              etat: value,
                            });
                          }
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="عرض الخيارات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>حالة الطلب</SelectLabel>
                            <SelectItem value="موافق عليه">موافق عليه</SelectItem>
                            <SelectItem value="قيد العمل">قيد العمل</SelectItem>
                            <SelectItem value="مرفوض">مرفوض</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">حفظ التغييرات</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>

          <TabsContent value="fichier">
            <Card>
              <CardHeader>
                <CardTitle>المرفقات</CardTitle>
              </CardHeader>
              <form onSubmit={registerFile} encType="multipart/form-data">
                <CardContent className="space-y-2">
                  <Label>الملفات</Label><span>{selectedValue?.fileName}</span>
                  <Input type="file" name="zipData" onChange={
                    (e) =>
                      setselectedValue({
                        ...selectedValue,
                        zipData: e.target.files?.[0] || null,
                        fileName: e.target.files?.[0].name || "",
                      })

                  } />
                </CardContent>
                <CardFooter className="gap-6">
                  <Button type="submit">حفظ التغييرات</Button>
                  <Link href={`http://localhost:8080/demande/download/${selectedValue?.id}`}><Button >download file</Button></Link>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>




      </MaxWidthWrapper >
    </>
  );
};

export default page;
