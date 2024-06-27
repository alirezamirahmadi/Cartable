
import NavBar from "@/components/navbar/NavBar"

export default function RootTemplate({children}: Readonly<{ children: React.ReactNode; }>): React.JSX.Element {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}