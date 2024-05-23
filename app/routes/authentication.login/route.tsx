import type {ActionFunctionArgs} from "@remix-run/node";
import {Form, useActionData} from "@remix-run/react";
import {
    jsonWithError,
    redirectWithSuccess
} from "remix-toast";
import {
    commitSession,
    getSession,
    redirectIfLoggedInLoader,
} from "~/lib/server/auth.server";
import {Button} from "~/ui/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "~/ui/components/ui/card";
import {Input} from "~/ui/components/ui/input";
import {Label} from "~/ui/components/ui/label";
import * as v from "valibot";
import {globalFetch} from "~/lib/server/fetch.server";
import type {LoginResponse} from "./schema";

interface ActionInterface {
    error: ErrorInterface;
}

interface ErrorInterface {
    global?: string;
    email?: string;
    password?: string;
}

export const loader = redirectIfLoggedInLoader;

export async function action({request}: ActionFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    let url_params = new URL(request.url);
    let params = Object.fromEntries(url_params.searchParams.entries()) as {
        redirect: string | undefined;
    };
    let redirect_params = params.redirect || "/";
    const formData = await request.formData();
    let email = String(formData.get("email") || "");
    let password = String(formData.get("password") || "");
    let error: ErrorInterface = {};
    if (email === "") {
        error = {
            email: "Please input email",
        };
        return jsonWithError({error}, "Invalid email", {
            status: 404,
        });
    }

    if (password === "") {
        error = {
            password: "Please input password",
        };
        return jsonWithError({error}, "Invalid password", {
            status: 404,
        });
    }

    let emailSchema = v.string([v.email("Invalid email")]);

    let emailValid = v.safeParse(emailSchema, email);

    if (!emailValid.success) {
        error = {
            email: "Please enter valid email",
        };

        return jsonWithError({error}, "Invalid email", {
            status: 404,
        });
    }

    let response = await globalFetch<LoginResponse>({
        method: "POST",
        endpoint: "/auth/login",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        request,
    });

    if (response.code !== 200) {
        error = {
            global: "Invalid email or password",
        };
        return jsonWithError({error}, "Invalid email or password", {
            status: 404,
        });
    }

    session.set("token", response.data.token);

    if (!response.data.user.profile) {
        return redirectWithSuccess(`/profile/edit?redirect=${redirect_params}`, "Success login! fill your profile",
            {
                headers: {
                    "Set-Cookie": await commitSession(session),
                }
            }
        )
    }

    return redirectWithSuccess(redirect_params, "Success Login!", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function LoginPage() {
    let actionData = useActionData<ActionInterface>();

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

                    {actionData?.error?.global && (
                        <p className="text-red-400">{actionData.error.global}</p>
                    )}

                    <Button variant="default" className="w-full">
                        Login
                    </Button>
                </Form>
            </CardContent>
        </Card>
    );
}
