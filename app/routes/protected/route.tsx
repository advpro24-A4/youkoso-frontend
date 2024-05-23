import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireAuthCookie } from "~/lib/server/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthCookie(request);

  console.log(user);

  return json({ user });
}
