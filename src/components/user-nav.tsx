import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { UserInfo } from "@/api/User";
import { api, getCurrentUser, logout } from "@/api";
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
import { toast } from "@/components/ui/use-toast";
import { Label } from "./ui/label";

export function UserNav() {
  const [user, setUser] = useState<UserInfo>();

  useQuery("currentUser", getCurrentUser(), {
    onSuccess: (data) => {
      setUser(data);
    }, // Set the user state to the data returned from the getCurrentUser function
  });

  const [open, setopen] = useState(false);
  const [password, setpassword] = useState("");

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const element = document.getElementById("password") as HTMLInputElement;
      if (password !== user?.password && element.value !== "") {
        toast({
          description: "كلمة المرور غير متطابقة",
          className: "destructive",
          duration: 3000,
          title: "خطأ",
        });
        return;
      }
      if (user && user.password && user.password.length < 6) {
        toast({
          description: "كلمة المرور يجب أن تكون أكثر من 6 أحرف",
          className: "destructive",
          duration: 3000,
          title: "خطأ",
        });
        return;
      } else if (user && user.password && user.password.trim() === "") {
        toast({
          description: "كلمة المرور لا يمكن أن تكون فارغة",
          className: "destructive",
          duration: 3000,
          title: "خطأ",
        });
        return;
      }
      const response = api
        .put(`/auth/updateUser/${user?.id}`, user)
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
        description: "حدث خطأ ما",
        className: "destructive",
        duration: 3000,
        title: "خطأ",
      });
    }
  };

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>
                {user?.roles == "USER_ROLES" ? "DE" : "AD"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setopen(true)}>
              معلوماتي الشخصية
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>تسجيل خروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div>
        <AlertDialog open={open} onOpenChange={setopen}>
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex">
                  معلوماتي الشخصية
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-row justify-between">
                      <Label>الإسم</Label>
                      <input
                        name="name"
                        type="text"
                        value={user?.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label>البريد الإلكتروني</Label>
                      <input
                        name="email"
                        type="email"
                        value={user?.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label>الدور</Label>
                      <p className="text-sm font-medium">{user?.roles}</p>
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label>المندوبية</Label>
                      <p className="text-sm font-medium">
                        {user?.deleguation?.nom || "لا يوجد مندوبية"}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label>التنسيقية</Label>
                      <p className="text-sm font-medium">
                        {user?.deleguation?.coordination?.nom ||
                          "لا يوجد منسقية"}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label>كلمة السر</Label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label>تأكيد كلمة السر</Label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                      />
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-8">
                <AlertDialogCancel className="bg-blue-800 text-white">
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  className="bg-blue-800 text-white"
                >
                  حفظ
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
