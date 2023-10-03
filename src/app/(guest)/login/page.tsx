"use client";

import {LoginForm} from "@/components/LoginForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Lottie from "lottie-react";
import loginAnimation from "@/assets/loginAnimation.json";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";

export default function Login() {
    return (
        <main className="flex flex-col min-h-screen items-center pb-1 sm:pb-0">
            <div className="flex flex-row self-end mt-3 gap-3 mr-3">
                <ThemeSwitcher className="flex"/>
                <LanguageSwitcher className="flex"/>
            </div>
            <Lottie animationData={loginAnimation} loop={true} className="w-10/12 md:w-7/12 lg:w-3/12" />
            <LoginForm />
        </main>
    )
}
