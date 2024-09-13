import { Box } from "@mui/material";

import Login from "@/components/login/login";

export default async function LoginPage() {

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, justifyContent: "center", alignItems: "center", height: "100vh", columnGap: 5 }}>
        <Login />
        <Box sx={{ width: { xs: "75%", md: "50%" } }}>
          <img src="/svg/pages/login/login.svg" alt="" />
        </Box>
      </Box>
    </>
  )
}