"use client";

import {useIntl} from "react-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input, Card, CardBody, CardFooter, CardHeader, Button} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {loginSchema, LoginSchema, LoginSchemaWithTotp} from "@/lib/types";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useTheme} from "next-themes";
import {ErrorCode} from "@/utils/ErrorCode";
import TwoFactorModal from "@/components/TwoFactorModal";

export const LoginForm = () => {
    const {theme} = useTheme();
    const router = useRouter();
    const {formatMessage, locale} = useIntl();
    const [showOTP, setShowOTP] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isValid, isSubmitting},
        trigger,
        getValues
    } = useForm<LoginSchema>({
        mode: "onTouched",
        resolver: zodResolver<any>(loginSchema({formatMessage}))
    });

    const emitI18nErrorToast = (id: string) => {
        toast.error(formatMessage({id: id}), {
            style: {
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "#fff" : "#333"
            }
        });
    }

    const signInWithErrorsHandled = async (data: LoginSchemaWithTotp) => {
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        });

        if (res === undefined) {
            emitI18nErrorToast("login.errors.generic");
            return false;
        }

        switch (res?.error) {
            case ErrorCode.SecondFactorRequired:
                setShowOTP(true);
                return false;
            case ErrorCode.UserNotFound:
                emitI18nErrorToast("login.errors.notfound");
                return false;
            case ErrorCode.IncorrectPassword:
                emitI18nErrorToast("login.errors.unauthorized");
                return false;
            case ErrorCode.IncorrectTwoFactorCode:
                emitI18nErrorToast("login.errors.twofactor");
                return false;
            case ErrorCode.InternalServerError:
                emitI18nErrorToast("login.errors.generic");
                return false;
        }

        if (res?.ok) {
            router.push("/");
        }
    }

    const onSubmit = async (data: LoginSchema) => {
        await signInWithErrorsHandled({...data, totpCode: ""});
    }

    const onTwoFactorSubmit = async (value: string) => {
        const res = await signInWithErrorsHandled({...getValues(), totpCode: value});
        if (!res) {
            setShowOTP(false);
        }
    }

    const onTwoFactorClose = () => {
        setShowOTP(false);
    }

    // trigger errored fields on locale change
    useEffect(() => {
        trigger(Object.keys(errors) as Array<keyof ("email" | "password" | ("email" | "password")[] | readonly ("email" | "password")[] | undefined)>);
    }, [errors, locale, trigger]);

    return (
        <form className="w-11/12 md:w-7/12 lg:w-5/12 lg:mt-unit-2xl md:my-auto mt-unit-xl"
              onSubmit={handleSubmit(onSubmit)}>
            <Card className="py-4 px-3 flex flex-col">
                <CardHeader className="flex flex-col items-center">
                    <h2 className="font-bold text-3xl md:text-4xl">{formatMessage({id: "login.title"})}</h2>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Input
                        type="email"
                        label={formatMessage({id: "login.labels.email"})}
                        variant="bordered"
                        errorMessage={errors.email && <>{errors.email.message}</>}
                        isInvalid={Boolean(errors.email)}
                        disabled={showOTP}
                        {...register("email")}
                    />
                    <Input
                        type="password"
                        label={formatMessage({id: "login.labels.password"})}
                        variant="bordered"
                        errorMessage={errors.password && <>{errors.password.message}</>}
                        isInvalid={Boolean(errors.password)}
                        disabled={showOTP}
                        {...register("password")}
                    />
                </CardBody>
                <CardFooter className="flex flex-col items-center px-5">
                    <Button type="submit" color="primary" variant="ghost" className="w-full"
                            isDisabled={!isValid || isSubmitting || showOTP}
                            isLoading={isSubmitting}>{isSubmitting ? "" : formatMessage({id: "login.submit"})}</Button>
                </CardFooter>
            </Card>
            {showOTP && (
                <TwoFactorModal onChange={onTwoFactorSubmit} onClose={onTwoFactorClose} />
            )}
        </form>
    )
}
