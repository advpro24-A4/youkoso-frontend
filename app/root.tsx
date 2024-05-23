import {
    json,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useMatches,
} from "@remix-run/react";
import "~/styles/tailwind.css";
import "@fontsource/geist-sans";
import {type LoaderFunctionArgs} from "@remix-run/node";
import {cx} from "class-variance-authority";
import Navbar from "~/lib/components/Navbar";
import {getToast} from "remix-toast";
import {useEffect} from "react";
import {toast as notify} from "sonner";
import {getUserFromRequest} from "./lib/server/auth.server";
import {parseColorScheme} from "./lib/server/theme.server";
import {
    ColorSchemeScript,
    useColorScheme,
} from "./lib/components/theme/theme";
import {GlobalLoading} from "./lib/components/GlobalLoading";
import {Toaster} from "./ui/components/ui/sonner";

export async function loader({request}: LoaderFunctionArgs) {
    const colorScheme = await parseColorScheme(request);
    let user = await getUserFromRequest(request);

    const {toast, headers} = await getToast(request);

    return json(
        {
            user,
            colorScheme,
            toast,
        },
        {
            headers,
        },
    );
}

export function Layout({children}: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();
    const matches = useMatches();
    const forceDark = matches.some(({handle}) => {
        if (handle && typeof handle === "object" && "forceDark" in handle) {
            return handle.forceDark;
        }
        return false;
    });
    return (
        <html
            lang="en"
            className={cx({
                dark: forceDark || colorScheme === "dark",
            })}
            data-theme={forceDark ? "dark" : colorScheme}
            suppressHydrationWarning
        >
        <head>
            <ColorSchemeScript forceConsistentTheme={forceDark}/>
            <meta charSet="utf-8"/>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <GlobalLoading/>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        <Toaster/>
        </html>
    );
}

export default function App() {
    const {toast} = useLoaderData<typeof loader>();

    useEffect(() => {
        if (toast?.type === "error") {
            notify.error(toast.message);
        }
        if (toast?.type === "success") {
            notify.success(toast.message);
        }
        if (toast?.type === "info") {
            notify.info(toast.message);
        }
    }, [toast]);
    return (
        <div className="flex min-h-screen flex-col overflow-hidden">
            <div className="z-20" id="nav">
                <Navbar/>
            </div>
            <div className="relative z-10 flex flex-grow py-20" id="content">
                <Outlet/>
            </div>
            <div className="z-20" id="footer"></div>
        </div>
    );
}
