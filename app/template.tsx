import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import NavBar from "@/components/navbar/navBar";
import { verifyToken } from "@/utils/token";

export default function RootTemplate({ children }: Readonly<{ children: React.ReactNode; }>): React.JSX.Element {

  const currentPath = headers().get("x-current-path");
  const isLoggedin = verifyToken(cookies().get("token")?.value ?? "");

  !isLoggedin && currentPath !== "/login" && redirect("/login");
  isLoggedin && currentPath === "/login" && redirect("/");

  return (
    <>
      <NavBar />
      {children}
    </>
  )
}