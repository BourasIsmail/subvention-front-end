"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { OPTIONS } from "@/data/options";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ZodError, ZodIssue } from "zod";
import {
  getAllCoordination,
  getDeleguationByCoordinationId,
} from "@/api/demande";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "./ui/separator";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const formSchema = z.object({
  nomAssociation: z.string().min(1, { message: "الاسم مطلوب" }),
  deleguation: z.object({
    id: z.coerce.number(),
  }),
  coordination: z.object({
    id: z.coerce.number(),
  }),
  numAutorisation: z.string().min(1, { message: "الرقم مطلوب" }),
  addresse: z.string().min(1, { message: "العنوان مطلوب" }),
  telephonePresident: z.string().min(1, { message: "الهاتف مطلوب" }),
  emailPresident: z.string().email().min(1, { message: "" }), // Assuming it's an email field
  nomPresident: z.string().min(1, { message: "الاسم مطلوب" }),
  nbrBeneficiairesHommes: z.coerce.number(),
  nbrBeneficiairesFemmes: z.coerce.number(),
  nbrAgentsHommes: z.coerce.number(),
  nbrAgentsFemmes: z.coerce.number(),
  sujetDemande: z.string().max(100).min(1, { message: "الموضوع مطلوب" }),
  nomEtablissement: z.string().min(1, { message: "الاسم مطلوب" }),
  nomDirecteur: z.string().min(1, { message: "الاسم مطلوب" }),
  telDirecteur: z.string().length(10, { message: "الهاتف مطلوب" }),
  emailDirecteur: z.string().email().min(1), // Assuming it's an email field
  typeMilieu: z.enum(["قروي", "حظري"]),
  rib: z.string().length(24, { message: "رقم الحساب البنكي مطلوب" }),
  capaciteChargeTotal: z.coerce.number(),
  cible: z.array(z.string()),
  montantSuggereParAssoc: z.coerce.number(),
});

export function DemandeForm() {
  const formArray = [1, 2, 3];
  const [formNo, setFormNo] = useState(formArray[0]);
  const next = () => {
    if (formNo === 1) {
      setFormNo(formNo + 1);
    } else if (formNo === 2) {
      setFormNo(formNo + 1);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };
  const pre = () => {
    setFormNo(formNo - 1);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: z.infer<typeof formSchema>, e: any) => {
    try {
      e.preventDefault();
      console.log(values);
      const response = api.post("/demande/addDemande", values).then((res) => {
        console.log(response);
        router.push(`/recu?code=${res.data.id}`);
      });
    } catch (error) {
      toast({
        description: "اسم مستخدم أو كلمة مرور غير صحيحة",
        variant: "destructive",
        duration: 3000,
        title: "خطأ",
      });
    }

    console.log(values);
  };

  const [selectedValue, setselectedValue] = useState<typeof formSchema>();
  const router = useRouter();

  const { data: coordination } = useQuery({
    queryKey: ["coordination"],
    queryFn: () => getAllCoordination(), // Remove the unnecessary argument from the function call
  });

  const { data: deleguation } = useQuery({
    queryKey: ["coordination", form.watch("coordination.id")],
    queryFn: () =>
      getDeleguationByCoordinationId(form.watch("coordination.id")),
    enabled: !!form.watch("coordination.id"), // Remove the unnecessary argument from the function call
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 gap-5"
        >
          <div className="flex justify-center items-center">
            {formArray.map((v, i) => (
              <>
                <div
                  className={`w-[35px] my-3 text-white rounded-full ${
                    formNo - 1 === i ||
                    formNo - 1 === i + 1 ||
                    formNo === formArray.length
                      ? "bg-blue-600"
                      : "bg-slate-400"
                  } h-[35px] flex justify-center items-center`}
                >
                  {v}
                </div>
                {i !== formArray.length - 1 && (
                  <div
                    className={`w-[85px] h-[2px] ${
                      formNo === i + 2 || formNo === formArray.length
                        ? "bg-blue-600"
                        : "bg-slate-400"
                    }`}
                  ></div>
                )}
              </>
            ))}
          </div>

          {formNo === 1 && (
            <div>
              <h1 id="first" className="text-3xl font-bold ">
                {" "}
                الجمعية
              </h1>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomAssociation"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>اسم الجمعية</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم الجمعية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="addresse"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="العنوان" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomPresident"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>اسم الرئيس</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم الرئيس" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="telephonePresident"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>هاتف الرئيس</FormLabel>
                        <FormControl>
                          <Input placeholder="هاتف الرئيس" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailPresident"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>بريد الكتروني للرئيس</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="بريد الكتروني للرئيس"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="rib"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>رقم الحساب البنكي</FormLabel>
                        <FormControl>
                          <Input placeholder="رقم الحساب البنكي" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="montantSuggereParAssoc"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>المبلغ المقترح من طرف الجمعية</FormLabel>
                      <FormControl>
                        <Input
                          className="w-1/2"
                          placeholder="المبلغ المقترح من طرف الجمعية"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex flex-row gap-4 justify-between">
                <FormField
                  control={form.control}
                  name="coordination.id"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>المنسقية</FormLabel>
                        <FormControl>
                          <div className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="عرض الخيارات" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>المنسقيات</SelectLabel>
                                  {coordination?.map((item) => (
                                    <SelectItem
                                      key={item.id}
                                      value={String(item.id)}
                                    >
                                      {item.nom}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="deleguation.id"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>المندوبية</FormLabel>
                        <FormControl>
                          <div className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="عرض الخيارات" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>المندوبيات</SelectLabel>
                                  {deleguation?.map((item) => (
                                    <SelectItem
                                      key={item.id}
                                      value={String(item.id)}
                                    >
                                      {item.nom}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="mt-4 gap-3 flex justify-center items-center">
                <Button onClick={next}>الخطوة التالية</Button>
              </div>
            </div>
          )}

          {formNo === 2 && (
            <div>
              <h1 id="second" className="text-3xl font-bold ">
                {" "}
                المؤسسة
              </h1>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomEtablissement"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>اسم المؤسسة</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المؤسسة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="emailDirecteur"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>بريد الكتروني للمدير</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="بريد الكتروني للمدير"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomDirecteur"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>اسم المدير</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المدير" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="telDirecteur"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>هاتف المدير</FormLabel>
                        <FormControl>
                          <Input placeholder="هاتف المدير" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numAutorisation"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>رقم الرخصة</FormLabel>
                        <FormControl>
                          <Input placeholder="رقم الرخصة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="capaciteChargeTotal"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>مجموع الطاقة الإستعابية المرخصة</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مجموع الطاقة الإستعابية المرخصة"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex flex-row justify-between">
                <FormField
                  control={form.control}
                  name="nbrBeneficiairesFemmes"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>عدد المستفيدات</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="عدد المستفيدات"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="nbrBeneficiairesHommes"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>عدد المستفيدين</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="عدد المستفيدين"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="cible"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>الفئة المستهدفة</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          defaultOptions={OPTIONS}
                          placeholder="الفئة المستهدفة"
                          onChange={(e) => {
                            field.value = e.map(
                              (option: Option) => option.value
                            );
                            form.setValue("cible", field.value);
                            console.log(field.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex flex-row justify-between">
                <FormField
                  control={form.control}
                  name="nbrAgentsFemmes"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>عدد المستخدمات</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="عدد المستخدمات"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="nbrAgentsHommes"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>عدد المستخدمين</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="عدد المستخدمين"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="typeMilieu"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>المجال الطبيعي</FormLabel>
                        <FormControl>
                          <div className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="عرض الخيارات" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>المجال الطبيعي</SelectLabel>
                                  <SelectItem value="حظري">حظري</SelectItem>
                                  <SelectItem value="قروي">قروي</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="mt-4 gap-3 flex justify-center items-center">
                <Button onClick={pre}>السابق </Button>
                <Button onClick={next}>الخطوة التالية</Button>
              </div>
            </div>
          )}
          {formNo === 3 && (
            <div>
              <h1 id="third" className="text-3xl font-bold ">
                {" "}
                الطلب
              </h1>
              <Separator />
              <FormField
                control={form.control}
                name="sujetDemande"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>موضوع الطلب</FormLabel>
                      <FormControl>
                        <Textarea placeholder="موضوع الطلب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="mt-4 gap-3 flex justify-center items-center">
                <Button onClick={pre}>السابق </Button>
                <Button type="submit">إرسال الطلب</Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
