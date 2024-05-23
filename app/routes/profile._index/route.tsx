import {type LoaderFunctionArgs} from "@remix-run/node";
import {Separator} from "~/ui/components/ui/separator";
import {Button} from "~/ui/components/ui/button";
import {Link, useLoaderData} from "@remix-run/react";
import {requireAuthCookie} from "~/lib/server/auth.server";
import {redirectWithInfo} from "remix-toast";

export async function loader({request}: LoaderFunctionArgs) {
    let user = await requireAuthCookie(request)

    if (!user.profile)
        return redirectWithInfo("/profile/edit", "Please fill your profile" +
            " first")
    return {user};
}

export default function ProfilePage() {
    let data = useLoaderData<typeof loader>()

    let birthDate = data.user.profile?.birth_date

    let formattedBirthDate = ""

    if (birthDate) {
        let date = new Date(birthDate)
        formattedBirthDate = date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    return (<div className="relative w-full px-10 flex flex-col gap-8">
        <div
            className='relative flex flex-row items-center justify-between'>
            <h1 className='font-semibold text-2xl'>My Profile</h1>
            <Link to="/profile/edit">
                <Button type={"button"} variant="outline">Edit</Button>
            </Link>
        </div>
        <Separator/>

        <div className="space-y-2">
            <h2 className='font-semibold'>Email</h2>
            <p>{data.user.email}</p>
        </div>

        <div className="space-y-2">
            <h2 className='font-semibold'>Name</h2>
            <p>{data.user.profile?.name}</p>
        </div>

        <div className="space-y-2">
            <h2 className='font-semibold'>Username</h2>
            <p>{data.user.profile?.username}</p>
        </div>

        <div className="space-y-2">
            <h2 className='font-semibold'>Address</h2>
            <p>{data.user.profile?.address}</p>
        </div>

        <div className="space-y-2">
            <h2 className='font-semibold'>Birth Date</h2>
            <p>{formattedBirthDate}</p>
        </div>

        <div className="space-y-2">
            <h2 className='font-semibold'>Phone number</h2>
            <p>{data.user.profile?.phone_number}</p>
        </div>
    </div>)
}

