import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/database";
import {compare} from "bcrypt";
import {NextApiRequest, NextApiResponse} from "next";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {ErrorCode} from "@/utils/ErrorCode";
import {symmetricDecrypt} from "@/utils/crypto";
import {authenticator} from "otplib";


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
                const {email, password, totpCode} = credentials;
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    throw new Error(ErrorCode.UserNotFound);
                }
                const isValid = await compare(password, user.password!);

                if (!isValid) {
                    throw new Error(ErrorCode.IncorrectPassword);
                }

                if (user.twoFactorEnabled) {
                    if (!totpCode) {
                        throw new Error(ErrorCode.SecondFactorRequired)
                    }

                    if (!user.twoFactorSecret) {
                        console.error(`Two factor is enabled for user ${user.email} but they have no secret`);
                        throw new Error(ErrorCode.InternalServerError);
                    }

                    if (!process.env.ENCRYPTION_KEY) {
                        console.error(`"Missing encryption key; cannot proceed with two factor login."`);
                        throw new Error(ErrorCode.InternalServerError);
                    }

                    const secret = symmetricDecrypt(user.twoFactorSecret, process.env.ENCRYPTION_KEY!);
                    if (secret.length !== 32) {
                        console.error(`Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`);
                        throw new Error(ErrorCode.InternalServerError);
                    }

                    const isValidToken = authenticator.check(credentials.totpCode, secret);
                    if (!isValidToken) {
                        throw new Error(ErrorCode.IncorrectTwoFactorCode);
                    }
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
                password: {label: "Password", type: "password"},
                totpCode: {label: "Two-factor Code", type: "input"},
            }
        })
    ],
    session: {strategy: "jwt", maxAge: 24 * 60 * 60},

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

        async jwt({token, user}) {
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
