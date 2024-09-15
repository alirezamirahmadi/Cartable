import { cookies } from "next/headers";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";

import Menu from "./menu";
import HamburgerMenu from "./hamburgerMenu";
import { MainMenuData } from "@/utils/data";
import MyAccount from "../general/myAccount/myAccount";
import { verifyToken } from "@/utils/token";
import { getMe } from "@/actions/auth";
import type { MeType } from "@/types/authType";
import { MenuType } from "@/types/NavBarType";

export default async function NavBar() {

  const token = cookies().get("token")?.value;
  const tokenPayload = verifyToken(token ?? "");

  const me: MeType = await getMe(tokenPayload);
  const menuItems = [...MainMenuData].filter((item: MenuType) => me.permissions.includes(item.href));

  return (
    <>
      {tokenPayload &&
        <AppBar position="static" sx={{ mb: 2 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <HamburgerMenu menuItems={menuItems} />
              <AdbIcon sx={{ display: "flex", mr: 1 }} />
              <Typography variant="h6" noWrap component="a" href="/"
                sx={{
                  mr: 2, display: "flex", flexGrow: 1, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem",
                  color: "inherit", textDecoration: "none",
                }}
              >LOGO</Typography>
              <Menu menuItems={menuItems} />
              <MyAccount me={me} />
            </Toolbar>
          </Container>
        </AppBar >
      }
    </>
  );
}
