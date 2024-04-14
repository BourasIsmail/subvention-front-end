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
import { getCurrentUser, logout } from "@/api";
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
import { Label } from "@radix-ui/react-label";

export function UserNav() {

  const [user, setUser] = useState<UserInfo>();

  useQuery("currentUser", getCurrentUser(), {
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const [open, setopen] = useState(false)

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  }

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>{user?.roles == "USER_ROLES" ? "DE" : "AD"}</AvatarFallback>
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
            <DropdownMenuItem onClick={() => setopen(true)}>معلوماتي الشخصية</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>تسجيل خروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div>
        <AlertDialog open={open} onOpenChange={setopen}>
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex">معلوماتي الشخصية</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex flex-col space-y-1">
                  <div className="flex flex-row justify-between">
                    <Label>الإسم</Label>
                    <p className="text-sm font-medium ">{user?.name}</p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <Label>البريد الإلكتروني</Label>
                    <p className="text-sm font-medium">{user?.email}</p>
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
                      {user?.deleguation?.coordination?.nom || "لا يوجد منسقية"}
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-8">
              <AlertDialogCancel className="bg-blue-800 text-white">إلغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
