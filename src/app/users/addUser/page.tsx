"use client";

import { api, getUser } from "@/api";
import { UserInfo } from "@/api/User";
import {
  Deleguation,
  getAllCoordination,
  getDeleguationByCoordinationId,
} from "@/api/demande";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { MainNav } from "@/components/main-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { UserNav } from "@/components/user-nav";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";

export default function Home() {
  const [selectedValue, setselectedValue] = useState<UserInfo>();
  const [password, setpassword] = useState(String);

  const { data: coordination } = useQuery({
    queryKey: ["coordination"],
    queryFn: () => getAllCoordination(), // Remove the unnecessary argument from the function call
  });

  const { data: deleguation } = useQuery({
    queryKey: ["coordination", selectedValue?.deleguation?.coordination?.id],
    queryFn: () =>
      getDeleguationByCoordinationId(
        selectedValue?.deleguation?.coordination?.id
      ),
    enabled: !!selectedValue?.deleguation?.coordination?.id, // Remove the unnecessary argument from the function call
  });

  console.log(selectedValue);

  interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    delegation: Deleguation;
  }
  const handleSubmit = (e: any) => {
    try {
      e.preventDefault();
      if (password !== selectedValue?.password) {
        toast({
          description: "كلمة المرور غير متطابقة",
          className: "destructive",
          duration: 3000,
          title: "خطأ",
        });
        return;
      }

      const response = api.post(`/auth/addUser`, selectedValue);
      toast({
        description: "تم تحديث البيانات بنجاح",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "نجاح",
      });
    } catch (error) {
      toast({
        description: "حدث خطأ ما",
        className: "destructive",
        duration: 3000,
        title: "خطأ",
      });
    }
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
      <MaxWidthWrapper className="pt-9">
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit}>
              <Label>الإسم</Label>
              <Input
                type="text"
                name="name"
                value={selectedValue?.name}
                onChange={(e) =>
                  setselectedValue({
                    ...selectedValue,
                    name: e.target.value || "",
                  })
                }
              />
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                name="email"
                value={selectedValue?.email}
                onChange={(e) =>
                  setselectedValue({
                    ...selectedValue,
                    email: e.target.value || "",
                  })
                }
              />
              <Label>كلمة السر</Label>
              <Input
                type="password"
                name="password"
                value={selectedValue?.password}
                onChange={(e) =>
                  setselectedValue({
                    ...selectedValue,
                    password: e.target.value || "",
                  })
                }
              />
              <Label>تأكيد كلمة السر</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <Label>الدور</Label>
              <Select
                defaultValue={selectedValue?.roles || ""}
                value={selectedValue?.roles || ""}
                name="role"
                onValueChange={(value) => {
                  setselectedValue({
                    ...selectedValue,
                    roles: value || "",
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="عرض الخيارات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الأدوار</SelectLabel>
                    <SelectItem value="ADMIN_ROLES">admin</SelectItem>
                    <SelectItem value="USER_ROLES">user</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label>المنسقية</Label>
                  <Select
                    name="coordination"
                    value={
                      selectedValue?.deleguation?.coordination?.id?.toString() ||
                      undefined
                    }
                    onValueChange={(value) => {
                      const coordinationSelected = coordination?.find(
                        (item) => item.id === Number(value)
                      );
                      setselectedValue((prevState) => ({
                        ...prevState,
                        deleguation: {
                          coordination: coordinationSelected,
                          id: prevState?.deleguation?.id,
                          nom: prevState?.deleguation?.nom,
                        },
                      }));
                    }}
                  >
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
                    name="delegation"
                    value={
                      selectedValue?.deleguation?.id?.toString() || undefined
                    }
                    onValueChange={(value) => {
                      setselectedValue({
                        ...selectedValue,
                        deleguation:
                          deleguation?.find(
                            (item) => item.id === Number(value)
                          ) || undefined,
                      });
                    }}
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
              <Button type="submit">إضافة حساب</Button>
            </form>
          </CardContent>
        </Card>
      </MaxWidthWrapper>
    </>
  );
}