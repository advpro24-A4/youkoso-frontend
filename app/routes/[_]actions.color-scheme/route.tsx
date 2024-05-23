import type { ActionFunctionArgs } from "@remix-run/node";
import { safeRedirect } from "~/lib/server/http.server";
import {
  serializeColorScheme,
  validateColorScheme,
} from "~/lib/server/theme.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const colorScheme = formData.get("colorScheme");
  if (!validateColorScheme(colorScheme)) {
    throw new Response("Bad Request", { status: 400 });
  }

  return safeRedirect(formData.get("returnTo"), {
    headers: { "Set-Cookie": await serializeColorScheme(colorScheme) },
  });
}
