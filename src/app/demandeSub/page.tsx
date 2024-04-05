import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { DemandeForm } from "@/components/demandeForm"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
    title: "Forms",
    description: "Advanced form example using react-hook-form and Zod.",
}



export default function Home() {
    return (
        <>
            <Navbar></Navbar>
            <MaxWidthWrapper>
                <div className="px-6 py-24 lg:px-8">
                    <DemandeForm />
                </div>
            </MaxWidthWrapper >


        </>
    );
}