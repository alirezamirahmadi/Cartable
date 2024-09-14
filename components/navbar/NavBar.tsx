import { cookies } from "next/headers";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";

import Menu from "./menu";
import { MainMenuData } from "@/utils/data";
import MyAccount from "../general/myAccount/myAccount";
import { verifyToken } from "@/utils/token";
import { getMe } from "@/actions/auth";
import type { MeType } from "@/types/authType";

export default async function NavBar() {

  const token = cookies().get("token")?.value;
  const tokenPayload = verifyToken(token ?? "");

  const me: MeType = await getMe(tokenPayload);

  return (
    <>
      {tokenPayload &&
        <AppBar position="static" sx={{ mb: 2 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Menu menuData={MainMenuData} hamburgerMenu permissions={me.permissions} />
              <AdbIcon sx={{ display: "flex", mr: 1 }} />
              <Typography variant="h6" noWrap component="a" href="/"
                sx={{
                  mr: 2, display: "flex", flexGrow: 1, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem",
                  color: "inherit", textDecoration: "none",
                }}
              >LOGO</Typography>
              <Menu menuData={MainMenuData} permissions={me.permissions} />
              <MyAccount me={me} />
            </Toolbar>
          </Container>
        </AppBar >
      }
    </>
  );
}
