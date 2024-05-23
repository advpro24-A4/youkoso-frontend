import {redirectIfLoggedInLoader} from "~/lib/server/auth.server";
import {type ActionFunctionArgs} from "@remix-run/node";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "~/ui/components/ui/card";
import {Form, useActionData} from "@remix-run/react";
import {Label} from "~/ui/components/ui/label";
import {Input} from "~/ui/components/ui/input";
import {Button} from "~/ui/components/ui/button";
import {jsonWithError, redirectWithSuccess} from "remix-toast";
import * as v from "valibot";
import {globalFetch} from "~/lib/server/fetch.server";

export const loader = redirectIfLoggedInLoader;

interface Error {
    email?: string,
    password?: string,
    confirmationPassword?: string
    global?: string
}

interface RegisterResponse {
    email: string,
    message: string
}

export async function action({request}: ActionFunctionArgs) {
    let formData = await request.formData()

    let formObj = Object.fromEntries(formData)

    let email = String(formObj.email || "")
    let password = String(formObj.password || "")
    let confirmPassword = String(formObj.confirmPassword || "")

    let error: Error = {}

    if (email === "") {
        error = {email: "Please enter email"}
        return jsonWithError({
            success: false,
            error
        }, "Invalid data", {status: 400})
    }

    if (password === "") {
        error = {password: "Please enter password"}
        return jsonWithError({
            success: false,
            error
        }, "Invalid data", {status: 400})
    }

    if (confirmPassword === "") {
        error = {confirmationPassword: "Please enter confirm password"}
        return jsonWithError({
            success: false,
            error,
        }, "Invalid data", {status: 400})
    }

    let emailSchema = v.string([v.email("Invalid email")]);

    let emailValid = v.safeParse(emailSchema, email);

    if (!emailValid.success) {
        error = {
            email: "Please enter valid email",
        };

        return jsonWithError({error}, "Invalid data", {
            status: 400,
        });
    }

    if (confirmPassword !== password) {
        error = {
            confirmationPassword: "Confirmation password not match"
        }
    }


    let response = await globalFetch<RegisterResponse>({
        method: "POST",
        endpoint: "/auth/register",
        body: JSON.stringify({
            email,
            password,
            "confirmation_password": confirmPassword
        })
    })

    if (response.code !== 200) {
        error = {
            global: response.data.message
        }
        return jsonWithError({error}, response.data.message, {
            status: 400
        })
    }

    return redirectWithSuccess("/authentication/login", "Success register! " +
        "please login")
}


export default function RegisterPage() {
    let actionData = useActionData<typeof action>()
    return (
        <Card className="w-[40%]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent
                className="w-full relative flex flex-col items-center p-4">
                <Form method="POST" className="w-full space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email"
                               placeholder="Enter your email"/>

                        {actionData?.error?.email && (
                            <p className="text-red-400">{actionData.error.email}</p>
                        )}

                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                        {actionData?.error?.password && (
                            <p className="text-red-400">{actionData.error.password}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="confirmation-password">Confirmation
                            Password</Label>
                        <Input
                            id="confirmation-password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                        />
                        {actionData?.error?.confirmationPassword && (
                            <p className="text-red-400">{actionData.error.confirmationPassword}</p>
                        )}
                    </div>
                    {actionData?.error?.global && (
                        <p className="text-red-400">{actionData.error.global}</p>
                    )}
                    <Button variant="default" className="w-full">
                        Register
                    </Button>
                </Form>
            </CardContent>
        </Card>)

}