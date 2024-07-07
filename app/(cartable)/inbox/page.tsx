
import TopBar from "@/components/cartable/inbox/topbar";
import SideBar from "../../../components/cartable/sidebar";

export default function Inbox(): React.JSX.Element {
  return (
    <>
      <TopBar />
      <div className="hidden lg:block">
        <SideBar />
      </div>
    </>
  )
}
