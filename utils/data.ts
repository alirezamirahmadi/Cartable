import { MenuType } from "@/types/NavBarType";

const MainMenuData: MenuType[] = [
  { id: "3", title: "کارتابل جاری", href: "/inbox" },
  { id: "4", title: "کارتابل پیگیری", href: "/outbox" },
  { id: "1", title: "اشخاص", href: "/persons" },
  { id: "2", title: "سمت ها", href: "/roles" },
  { id: "5", title: "گروه ها", href: "/groups" },
  { id: "6", title: "مجوز ها", href: "/permissions" },
]

export {
  MainMenuData
}