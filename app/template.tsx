// import { headers } from "next/headers";

import NavBar from "@/components/navbar/NavBar";
import BottomNavigation from "@/components/bottomNavigation/bottomNavigation";

export default function RootTemplate({ children }: Readonly<{ children: React.ReactNode; }>): React.JSX.Element {

  // const currentPath = headers().get("x-current-path");

  return (
    <>
      <NavBar />
      {children}
      <BottomNavigation />
    </>
  )
}