import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from "@prisma/client";
import {compare} from "bcrypt";
import {NextApiRequest, NextApiResponse} from "next";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {getIntlWithLocale} from "@/components/intl";


const prisma = new PrismaClient();

const adapter = PrismaAdapter(prisma);

export const authOptions: AuthOptions = {
    pages: {
        signIn: "/login",
    },
    adapter,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            async authorize(credentials: any, req: any): Promise<any> {
                const cookie = req.headers.cookie;
                const locale = cookie?.split(";").find((c: string) => c.trim().startsWith("NEXT_LOCALE="))?.split("=")[1];
                const intl = getIntlWithLocale(locale ?? "en");

                const {email, password} = credentials;
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    throw new Error(intl.formatMessage({id: "login.errors.notfound"}));
                }
                const isValid = await compare(password, user.password!);

                if (!isValid) {
                    throw new Error(intl.formatMessage({id: "login.errors.unauthorized"}));
                }

                return {
                    email: user.email,
                    id: user.id,
                    name: user.name
                };


            },
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            }
        })
    ],
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },

    callbacks: {
        async session({session, token, user}) {
            if (user !== null) {

                session.user = user;
            }
            return session;
        },

        async jwt({ token, user }) {
            return token;
        },
    }
}

export async function GET(request: NextApiRequest, res: NextApiResponse) {
    return NextAuth(request, res, authOptions);
}

export async function POST(request: NextApiRequest, res: NextApiResponse) {
    return NextAuth(request, res, authOptions);
}
