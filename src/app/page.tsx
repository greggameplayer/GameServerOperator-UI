"use client";

import { useIntl } from 'react-intl';
import {LoginForm} from "@/components/LoginForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
    const { formatMessage } = useIntl();

    return (
        <main className="flex flex-col min-h-screen items-center">
            <LanguageSwitcher className="flex self-end mr-3 mt-3"/>
            <LoginForm />
        </main>
    )
}
