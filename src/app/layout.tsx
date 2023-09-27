import '@/app/globals.css'
import {Inter} from 'next/font/google'
import {ClientProviders} from "@/app/clientProviders";
import {ServerProviders} from "@/app/serverProviders";
import {Metadata} from "next";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'GSO UI'
}

export default function RootLayout({children}: { children: React.ReactNode }) {

    return (
        <html className={`${inter.className}`} suppressHydrationWarning>
        <body>
        <ServerProviders>
            <ClientProviders>
                {children}
            </ClientProviders>
        </ServerProviders>
        </body>
        </html>
    )
}
