import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "@remix-run/react";
import { redirectIfLoggedInLoader } from "~/lib/server/auth.server";
import { Button } from "~/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/ui/components/ui/card";

export const loader = redirectIfLoggedInLoader;

export default function AuthenticationIndex() {
  return (
    <div className="relative flex flex-col w-full px-10 py-5 items-center top-10">
      <div className="flex flex-col w-full items-center justify-center">
        <Card className="flex flex-col items-center justify-center w-[40%] h-[300px] gap-10">
          <CardHeader>
            <CardTitle className="text-center">Pacilflix - F4</CardTitle>
          </CardHeader>

          <CardContent className="w-full relative flex flex-col items-center ">
            <Link
              to="/authentication/login"
              className="flex items-center justify-center w-full"
            >
              <Button variant="default" className="w-[75%]">
                Login
              </Button>
            </Link>

            <div className="relative w-full my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Link
              to="/authentication/register"
              className="flex items-center justify-center w-full"
            >
              <Button variant="outline" className="w-[75%]">
                Register
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
