import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "~/ui/components/ui/card";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {Label} from "~/ui/components/ui/label";
import {Input} from "~/ui/components/ui/input";
import {Button} from "~/ui/components/ui/button";
import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs
} from "@remix-run/node";
import {jsonWithError, redirectWithSuccess} from "remix-toast";
import {type User} from "~/routes/authentication.login/schema";
import {globalFetch} from "~/lib/server/fetch.server";
import {requireAuthCookie} from "~/lib/server/auth.server";

interface Error {
    username?: string,
    name?: string,
    address?: string,
    birthDate?: string,
    phoneNumber?: string,
    global?: string,
}

interface ProfileResponse {
    message: string,
    user: User
}

export async function loader({request}: LoaderFunctionArgs) {
    let user = await requireAuthCookie(request)
    console.log(user)
    return {user}
}

export async function action({request}: ActionFunctionArgs) {
    let formData = await request.formData()
    let formObj = Object.fromEntries(formData)
    let url_params = new URL(request.url);
    let params = Object.fromEntries(url_params.searchParams.entries()) as {
        redirect: string | undefined;
    };
    let redirect_params = params.redirect || "/profile";
    let username = String(formObj.username || "")
    let name = String(formObj.name || "")
    let address = String(formObj.address || "")
    let birthDate = String(formObj.birthDate || "")
    let phoneNumber = String(formObj.phoneNumber || "")

    let error: Error = {}

    if (name === "") {
        error = {
            name: "Please enter name",
        }
        return jsonWithError({
            error
        }, "Invalid data", {
            status: 400
        })
    }

    if (username === "") {
        error = {
            username: "Please enter username",
        }
        return jsonWithError({
            error
        }, "Invalid data", {
            status: 400
        })
    }

    if (address === "") {
        error = {
            address: "Please enter address",
        }
        return jsonWithError({
            error
        }, "Invalid data", {
            status: 400
        })
    }

    if (birthDate === "") {
        error = {
            birthDate: "Please enter birth date",
        }
        return jsonWithError({
            error
        }, "Invalid data", {
            status: 400
        })
    }

    if (phoneNumber === "") {
        error = {
            phoneNumber: "Please enter phone number",
        }
        return jsonWithError({
                error
            }, "Invalid data",
            {
                status: 400
            }
        )
    }

    let response = await globalFetch<ProfileResponse>(
        {
            method: "POST",
            endpoint: "/profile",
            body: JSON.stringify({
                name,
                username,
                address,
                "birth_date": birthDate,
                "phone_number": phoneNumber
            }),
            isAuthorized: true,
            request
        }
    )


    if (response.code !== 200) {
        error = {
            global: response.data.message
        }
        return jsonWithError({error}, response.data.message, {
            status: 400
        })
    }
    return redirectWithSuccess(redirect_params, "Success change your profile")
}

export default function EditProfilePage() {
    let actionData = useActionData<typeof action>()
    let loaderData = useLoaderData<typeof loader>()
    return (
        <div
            className="relative flex flex-col w-full px-10 py-5 items-center top-10">
            <div className="flex flex-col w-full items-center justify-center">

                <Card className="w-[40%]">
                    <CardHeader>
                        <CardTitle>{loaderData.user.profile ? 'Edit' +
                            ' Profile' : "Create Profile"}</CardTitle>
                    </CardHeader>

                    <CardContent
                        className="w-full relative flex flex-col items-center p-4">
                        <Form method="POST" className="w-full space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name"
                                       defaultValue={loaderData.user.profile?.name ?? ""}
                                       placeholder="Please enter your name"/>

                                {actionData?.error?.name && (
                                    <p className="text-red-400">{actionData.error.name}</p>
                                )}

                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Please enter your username"
                                    defaultValue={loaderData.user.profile?.username ?? ""}
                                />
                                {actionData?.error?.username && (
                                    <p className="text-red-400">{actionData.error.username}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Please enter your address"
                                    defaultValue={loaderData.user.profile?.address}
                                />

                                {actionData?.error?.address && (
                                    <p className="text-red-400">{actionData.error.address}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="birth-date">Birth Date</Label>
                                <Input
                                    id="birth-date"
                                    name="birthDate"
                                    type="date"
                                    placeholder="Please enter your birth date"
                                    defaultValue={loaderData.user.profile?.birth_date}
                                />
                                {actionData?.error?.birthDate && (
                                    <p className="text-red-400">{actionData.error.birthDate}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="phone-number">Phone
                                    Number</Label>
                                <Input
                                    id="phone-number"
                                    name="phoneNumber"
                                    type="text"
                                    placeholder="Please enter your phone number"
                                    defaultValue={loaderData.user.profile?.phone_number}
                                />
                                {actionData?.error?.phoneNumber && (
                                    <p className="text-red-400">{actionData.error.phoneNumber}</p>
                                )}
                            </div>

                            {actionData?.error?.global && (
                                <p className="text-red-400">{actionData.error.global}</p>
                            )}
                            <Button variant="default" className="w-full">
                                Submit
                            </Button>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
