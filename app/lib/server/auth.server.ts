import type { LoaderFunctionArgs } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { safeRedirect } from "./http.server";
import { User } from "~/routes/authentication.login/schema";
import { globalFetch } from "./fetch.server";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
  );
  secret = "default-secret";
}

interface VerifyUserResponse {
  message: string;
  user: User;
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secrets: [secret],
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });

export async function requireAuthCookie(request: Request): Promise<User> {
  const session = await getSession(request.headers.get("Cookie"));
  let token = session.get("token");
  if (!token) {
    session.unset("token");
    throw redirect("/authentication/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  let response = await globalFetch<VerifyUserResponse>({
    method: "GET",
    endpoint: "/auth/verify",
    body: null,
    request,
    isAuthorized: true,
  });

  if (response.code !== 200) {
    session.unset("token");
    throw redirect("/authentication/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  let user: User = response.data.user;
  return user;
}

export async function getUserFromRequest(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  let token = session.get("token") as string;
  return token;
}

export async function redirectIfLoggedInLoader({
  request,
}: LoaderFunctionArgs) {
  let token = await getUserFromRequest(request);
  if (token) {
    throw safeRedirect("/");
  }
  return null;
}

export { getSession, commitSession, destroySession };
