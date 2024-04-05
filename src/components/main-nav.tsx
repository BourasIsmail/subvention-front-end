import Link from "next/link";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserInfo } from "@/api/User";
import { getCurrentUser } from "@/api";
import { useQuery } from "react-query";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

  const [user, setUser] = useState<UserInfo>();

  useQuery("currentUser", getCurrentUser(), {
    onSuccess: (data) => {
      setUser(data);
    },
  });

  return (
    <nav className={cn("flex items-center gap-10", className)} {...props}>
      <Link
        href="/dashboard"
        className="text-base font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        لوحة القيادة
      </Link>

      <Link
        href="/subvention"
        className="text-base font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        الطلبات
      </Link>
      {user?.deleguation == null && (
        <Link
          href="/users"
          className="text-base font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          حسابات المستخدمين
        </Link>)}
    </nav>
  );
}
