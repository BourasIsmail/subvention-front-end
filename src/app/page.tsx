import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import RightSideHome from "@/components/RightSideHome";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <>
      <div className="container relative hidden h-[700px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          <Image src={"/LOGO.jpg"} alt="Close" width={100} height={55} />
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                تطبيق إرسال طلب منحة
              </h1>
              <p className="text-lg text-muted-foreground">
                اضغط على الزر أدناه لإرسال الطلب
              </p>
            </div>
            <RightSideHome />
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r col-span-2">
          <div className="absolute inset-0 bg-[url('/inf.jpg')] bg-cover bg-no-repeat " />

          <div className="relative z-20 flex items-center text-lg font-medium"></div>
          <div className="relative z-20 mt-auto"></div>
        </div>
      </div>
    </>
  );
}
