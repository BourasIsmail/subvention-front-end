'use client';
import { api } from "@/api";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Navbar from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useMutation } from "react-query";
import { setCookie, deleteCookie } from "cookies-next";

export default function Home() {

    const [userName, setuserName] = useState("")
    const [password, setpassword] = useState("")
    const { toast } = useToast()

    const login = async () => {

        try {
            const response = await api.post('/auth/login', { userName, password })
            console.log(response.data);
            setCookie("token", response.data, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            toast({
                description: "تم تسجيل الدخول بنجاح",
                className: "bg-green-500 text-white",
                duration: 2000,
                title: "نجاح",
            })

            window.location.href = "/dashboard"

        } catch (error) {
            toast({
                description: "اسم مستخدم أو كلمة مرور غير صحيحة",
                variant: "destructive",
                duration: 3000,
                title: "خطأ",
            })
        }
    }


    function handleSubmit(event: any) {
        event.preventDefault()
        login()
    }

    return (
        <>
            <Navbar />
            <MaxWidthWrapper>
                <div className="flex min-h-full flex-col justify-center px-6 py-24 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-full w-auto"
                            src="/LOGO.jpg"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            مخصص لمستخدمين التعاون الوطني
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    اسم المستخدم
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setuserName(e.target.value)}
                                        autoComplete="username"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        كلمة المرور
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setpassword(e.target.value)}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    تسجيل الدخول
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </MaxWidthWrapper>
        </>
    );
}
