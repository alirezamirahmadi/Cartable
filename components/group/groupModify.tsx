"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Box, IconButton } from "@mui/material"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

const Snack = dynamic(() => import("@/components/general/snack/snack"));
const ModifyButtons = dynamic(() => import("@/components/general/modifyButtons/modifyButtons"));
const TextSave = dynamic(() => import("@/components/general/textSave/textSave"));
import { useAppSelector } from "@/lib/hooks";
import type { SnackProps } from "@/types/generalType";

export default function GroupModify({ rootId }: { rootId: string | null }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const groupTitle = searchParams.get("title");
  const [anchorGroup, setAnchorGroup] = useState<null | HTMLElement>(null);
  const [anchorFolder, setAnchorFolder] = useState<null | HTMLElement>(null);
  const [anchorEdit, setAnchorEdit] = useState<null | HTMLElement>(null);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  const handleActionNew = async (value: string, kind: number) => {
    kind === 1 ? setAnchorFolder(null) : setAnchorGroup(null);

    value && await fetch("api/v1/groups", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ title: value, root: rootId, kind })
    })
      .then(res => {
        res.status === 201 ?
          router.refresh()
          :
          setSnackProps({ context: `جدید با مشکل مواجه شده است ${kind === 1 ? "پوشه" : "گروه"}ایجاد `, isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      })
      .catch(() => {
        setSnackProps({ context: `جدید با مشکل مواجه شده است ${kind === 1 ? "پوشه" : "گروه"}ایجاد `, isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      })
  }

  const handleModifyAction = (data: any, action: string) => {
    switch (action) {
      case "Edit":
        setAnchorEdit(document.getElementById("ibtnNewGroup"));
        break;
      case "Delete":
        deleteGroup();
        break;
    }
  }
  const handleActionEdit = async (value: string) => {
    setAnchorEdit(null);

    value && await fetch(`api/v1/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ title: value, root: rootId })
    })
      .then(res => {
        switch (res.status) {
          case 201:
            router.refresh();
            setSnackProps({ context: "ویرایش نام پوشه/گروه با موفقیت انجام شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
            break;
          default:
            setSnackProps({ context: "ویرایش نام پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
            break;
        }
      })
      .catch(() => {
        setSnackProps({ context: "ویرایش نام پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  const deleteGroup = async () => {
    groupId &&
      await fetch(`api/v1/groups/${groupId}`, {
        method: "DELETE"
      })
        .then(res => {
          switch (res.status) {
            case 200:
              router.replace("/groups");
              setSnackProps({ context: "حذف پوشه/گروه با موفقیت انجام شد", isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              break;
            case 403:
              setSnackProps({ context: "امکان حذف پوشه/گروه به دلیل داشتن زیر مجموعه وجود ندارد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              break;
            default:
              setSnackProps({ context: "حذف پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              break;
          }
        })
        .then(() => router.refresh())
        .catch(() => {
          setSnackProps({ context: "حذف پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
        })
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {me.permissions.includes("/groups.new") &&
          <>
            <IconButton id="ibtnNewGroup" onClick={event => setAnchorGroup(event.currentTarget)} title="گروه جدید">
              <GroupAddIcon />
            </IconButton>
            <TextSave anchor={anchorGroup} onAction={value => handleActionNew(value, 2)} label="گروه جدید" />
            <IconButton onClick={event => setAnchorFolder(event.currentTarget)} title="پوشه جدید">
              <CreateNewFolderIcon />
            </IconButton>
            <TextSave anchor={anchorFolder} onAction={value => handleActionNew(value, 1)} label="پوشه جدید" />
          </>
        }
        {groupId && <ModifyButtons edit={me.permissions.includes("/groups.edit")} omit={me.permissions.includes("/groups.delete")} rowData={undefined} onAction={handleModifyAction} omitMessage={`آیا از حذف "${groupTitle}" اطمینان دارید`} />}
        <TextSave anchor={anchorEdit} onAction={handleActionEdit} defaultValue={groupTitle ?? ""} />
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}