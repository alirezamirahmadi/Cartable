import { cookies } from "next/headers";
import { BottomNavigation as MUIBottomNavigation } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';

import { verifyToken } from "@/utils/token";
import BottomNavigationItem from "./bottomNavigationItem";
import { getMe } from "@/actions/auth";
import type { MeType } from "@/types/authType";

export default async function BottomNavigation() {

  const token = cookies().get("token")?.value;
  const tokenPayload = verifyToken(token ?? "");

  const me: MeType = await getMe(tokenPayload);

  return (
    <>
      {tokenPayload &&
        <MUIBottomNavigation sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", width: "100%", position: "fixed", bottom: 0, borderTop: 1 }}>
          {me.permissions.includes("/inbox") && <BottomNavigationItem label="کارتابل جاری" icon={<InboxIcon />} href="/inbox" />}
          {me.permissions.includes("/outbox") && <BottomNavigationItem label="کارتابل پیگیری" icon={<OutboxIcon />} href="/outbox" />}
        </MUIBottomNavigation>
      }
    </>
  );
}
