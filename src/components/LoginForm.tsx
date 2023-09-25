"use client";

import {useIntl} from "react-intl";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input, Card, CardBody, CardFooter, CardHeader, Button} from "@nextui-org/react";

export const LoginForm = () => {
    const {formatMessage} = useIntl();

    const schema = z.object({
        email: z.string().nonempty({message: formatMessage({id: "login.errors.email.required"})}).email({message: formatMessage({id: "login.errors.email.format"})}),
        password: z.string().nonempty({message: formatMessage({id: "login.errors.password.required"})}).min(8, {message: formatMessage({id: "login.errors.password.min"})}),
    });

    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver<any>(schema)
    });

    const onSubmit = (data: any) => {
        console.log(data);
    }

    return (
        <form className="w-11/12 md:w-7/12 lg:w-5/12 my-auto" onSubmit={handleSubmit(onSubmit)}>
            <Card className="py-4 px-3 flex flex-col">
                <CardHeader className="flex flex-col items-center">
                    <h2 className="font-bold text-4xl">{formatMessage({id: "login.title"})}</h2>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Input
                        type="email"
                        label={formatMessage({id: "login.labels.email"})}
                        variant="bordered"
                        errorMessage={errors.email && <>{errors.email.message}</>}
                        isInvalid={Boolean(errors.email)}
                        {...register("email")}
                    />
                    <Input
                        type="password"
                        label={formatMessage({id: "login.labels.password"})}
                        variant="bordered"
                        errorMessage={errors.password && <>{errors.password.message}</>}
                        isInvalid={Boolean(errors.password)}
                        {...register("password")}
                    />
                </CardBody>
                <CardFooter className="flex flex-col items-center px-5">
                    <Button type="submit" color="primary" variant="ghost" className="w-full"
                            isDisabled={!isValid}>{formatMessage({id: "login.submit"})}</Button>
                </CardFooter>
            </Card>
        </form>
    )
}
