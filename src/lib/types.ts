import * as z from "zod";


export const loginSchema = ({formatMessage} : {formatMessage: any }) => z.object({
    email: z.string().nonempty({message: formatMessage({id: "login.errors.email.required"})}).email({message: formatMessage({id: "login.errors.email.format"})}),
    password: z.string().nonempty({message: formatMessage({id: "login.errors.password.required"})}).min(8, {message: formatMessage({id: "login.errors.password.min"})}),
});

// unwrap from arrow function
export type LoginSchema = { email: string; password: string };
