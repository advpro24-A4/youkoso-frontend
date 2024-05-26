import { type LoaderFunctionArgs } from "@remix-run/node";
import { Separator } from "~/ui/components/ui/separator";
import { Button } from "~/ui/components/ui/button";
import { Link, useLoaderData } from "@remix-run/react";
import {requireAuthCookie} from "~/lib/server/auth.server";
import { redirectWithInfo } from "remix-toast";

interface Voucher {
    id: number;
    name: string;
    discountPercentage: number;
    hasUsageLimit: boolean;
    usageLimit: number;
    minimumOrder: number;
    maximumDiscountAmount: number;
}

interface VoucherListResponse {
    message: string;
    voucherData: Voucher[];
    paymentId: bigint;
}

export async function loader({ request }: LoaderFunctionArgs) {
    // let user = await requireAuthCookie(request);

    // let paymentId = 0;

    try {
        let url = `http://34.122.230.153/voucher/api/read-all`;
        const response = await fetch(url);
        const voucherData: Voucher[] = await response.json();
        // return { user, voucherData };
        return { voucherData };
    } catch (error) {
        console.error("Failed to retrieve vouchers information: ", error);
        throw error;
    }
}

export default function VoucherListPage() {
    // const { user, voucherData } = useLoaderData<typeof loader>();
    const { voucherData } = useLoaderData<typeof loader>();
    const INTEGER_MAX_VALUE = 2147483647;

    return (
        <div className="relative w-full px-10 flex flex-col gap-8">
            <div className="relative flex flex-row items-center justify-between">
                <h1 className="font-semibold text-2xl">Voucher List Page</h1>
            </div>
            <Separator />
            {voucherData.map((voucher, index) => (
                <div key={index} className="space-y-2">
                    <h1 className="font-semibold">
                        {voucher.name} - Discount {voucher.discountPercentage}%
                    </h1>
                    {!voucher.hasUsageLimit &&
                    voucher.minimumOrder === 0 &&
                    voucher.maximumDiscountAmount === INTEGER_MAX_VALUE ? (
                        <p className="space-y-2">There are no terms and conditions</p>
                    ) : (
                        <>
                            <p>Terms and Conditions</p>
                            <ul className="space-y-2 list-disc pl-5">
                                {voucher.hasUsageLimit && (
                                    <li> - Remaining usage quota: {voucher.usageLimit}</li>
                                )}
                                {voucher.minimumOrder !== 0 && (
                                    <li> - Minimum order: Rp.{voucher.minimumOrder},-</li>
                                )}
                                {voucher.maximumDiscountAmount !== INTEGER_MAX_VALUE && (
                                    <li> - Maximum discount: Rp.{voucher.maximumDiscountAmount},-</li>
                                )}
                            </ul>
                        </>
                    )}
                    <div className="mt-4">
                        <Button type="button" variant="outline">
                            Use Voucher
                        </Button>
                        {/* if the button is clicked, call `http://34.122.230.153/voucher/list` dengan method post
                        dan request body berisikan paymentId dan voucher.id*/}
                    </div>
                </div>
            ))}
        </div>
    );
}
