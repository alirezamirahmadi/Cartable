// import { headers } from "next/headers";

import NavBar from "@/components/navbar/navBar";

export default function RootTemplate({ children }: Readonly<{ children: React.ReactNode; }>): React.JSX.Element {

  // const currentPath = headers().get("x-current-path");

  return (
    <>
      <NavBar />
      {children}
    </>
  )
}