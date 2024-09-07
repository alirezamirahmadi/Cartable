"use client"

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Box, List, ListItemButton, ListItemText, ListItem, IconButton, Checkbox, Breadcrumbs, Button } from "@mui/material"
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';

import Loading from "../general/loading/loading";
const Modal = dynamic(() => import("@/components/general/modal/modal"), { loading: () => <Loading /> });
const Snack = dynamic(() => import("@/components/general/snack/snack"));
import Roles from "@/components/role/roles";
import TreeActions from "../general/treeActions/treeActions";
import GroupModify from "./groupModify";
import { useAppSelector } from "@/lib/hooks";
import type { GroupType } from "@/types/groupType";
import type { RoleType } from "@/types/roleType";
import type { SnackProps } from "@/types/generalType";

export default function GroupTree({ groups, isTransfer, onTransfer }: { groups: GroupType[], isTransfer?: boolean, onTransfer?: (root: string) => void }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [roots, setRoots] = useState<GroupType[]>([{ _id: null, title: "خانه", root: "-1", kind: 1 }]);
  const [groupsList, setGroupsList] = useState<GroupType[]>([]);
  const [openRolesModal, setOpenRolesModal] = useState<{ isOpen: boolean, refGroup: string | null }>({ isOpen: false, refGroup: "" });
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [checkedGroups, setCheckedGroups] = useState<string[]>([]);
  const [isOpenTransferModal, setIsOpenTransferModal] = useState<boolean>(false);

  const loadGroupList = (searchContent?: string) => {
    setGroupsList([...groups].filter((group: GroupType) => !searchContent ? group.root === roots[roots.length - 1]._id : group.title.includes(searchContent ?? "")))
  }

  useMemo(() => {
    loadGroupList();
  }, [roots, groups])

  const loadGroupMembers = async (refGroup: string) => {
    await fetch(`api/v1/groupMembers?refGroup=${refGroup}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setRoles(data))
  }

  const handleSubGroup = (group: GroupType) => {
    switch (group.kind) {
      case 1:
        router.replace("/groups");
        setRoots([...roots, group]);
        break;
      case 2:
        loadGroupMembers(group._id ?? "").then(() => setOpenRolesModal({ isOpen: true, refGroup: group._id }))
        break;
    }
  }

  const handleBreadcrumbs = (root: GroupType) => {
    router.replace("/groups");

    const tempRoots: GroupType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);

    setRoots(tempRoots);
  }

  const handleToggle = (groupId: string) => {
    const index = checkedGroups.indexOf(groupId);

    if (!isTransfer) {
      const tempChecked = [...checkedGroups];
      index === -1 ? tempChecked.push(groupId) : tempChecked.splice(index, 1);
      setCheckedGroups(tempChecked);
    }
    else {
      setCheckedGroups(index === -1 ? [groupId] : []);
    }
  }

  const handleTransfer = () => {
    isTransfer && onTransfer ? onTransfer(checkedGroups.length === 1 ? checkedGroups[0] : "") : setIsOpenTransferModal(true);
  }

  const handleTransferTo = async (root: string) => {
    setIsOpenTransferModal(false);

    if (checkedGroups.includes(root)) {
      setSnackProps({ context: "پوشه/گروه مقصد نمی تواند از پوشه/گروه های انتخاب شده جهت انتقال باشد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      return;
    }

    await fetch(`api/v1/groups`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ groupIds: checkedGroups, root })
    }).then(res => {
      if (res.status === 201) {
        router.refresh();
        setCheckedGroups([]);
      }
    })
  }
  
  const handleGroupMembersAction = async (role: RoleType, action: string) => {
    switch (action) {
      case "SelectRole":
        addGroupMember(role);
        break;
      case "Delete":
        deleteGroupMember(role._id ?? "");
        break;
    }
  }

  const addGroupMember = async (role: RoleType) => {
    openRolesModal && await fetch(`api/v1/groupMembers`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ refGroup: openRolesModal.refGroup, refRole: role._id })
    })
      .then(res => { res.status === 201 && loadGroupMembers(openRolesModal.refGroup ?? "") })
  }

  const deleteGroupMember = async (refRole: string) => {
    openRolesModal && await fetch(`api/v1/groupMembers?refGroup=${openRolesModal.refGroup}&refRole=${refRole}`, {
      method: "DELETE",
    })
      .then(res => { res.status === 200 && loadGroupMembers(openRolesModal.refGroup ?? "") })
  }

  const handleTreeAction = (root: any[], action: string, searchContent: string | undefined) => {
    switch (action) {
      case "Search":
        router.replace("/groups");
        loadGroupList(searchContent);
        break;
      case "Reset":
        setRoots(root);
        break;
      case "Backward":
        setRoots(root);
        break;
    }
  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 356, bgcolor: 'background.paper' }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: GroupType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.title}</Button>
          ))}
        </Breadcrumbs>
        <Box sx={{ display: "flex" }}>
          <GroupModify rootId={roots[roots.length - 1]._id !== "-1" ? roots[roots.length - 1]._id : null} />
          {me.permissions.includes("/groups.edit") &&
            <IconButton onClick={handleTransfer} disabled={checkedGroups.length === 0} title={isTransfer ? "انتقال به" : "انتقال"}>
              {isTransfer ? <MoveDownIcon /> : <MoveUpIcon />}
            </IconButton>
          }
        </Box>

        <List component="nav" sx={{ py: 0 }}>
          <ListItem component="div" disablePadding sx={{ px: 1, pb: 1 }}>
            <TreeActions roots={roots} search reset backward onAction={handleTreeAction} />
          </ListItem>
          {groupsList.map((group: GroupType) => (
            <ListItem key={group._id} sx={{ py: 0, minHeight: 24 }}>
              <Checkbox disabled={(isTransfer && group.kind === 2)} checked={checkedGroups.includes(group._id ?? "")} onChange={() => handleToggle(group._id ?? "")} />
              <IconButton onClick={() => handleSubGroup(group)}>
                {group.kind === 1 ? <FolderSharedIcon /> : <GroupIcon />}
              </IconButton>
              <ListItemButton sx={{ py: 0 }} selected={groupId === group._id} onClick={() => router.replace(`/groups?groupId=${group._id}&title=${group.title}`)}>
                <ListItemText primary={group.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
      {openRolesModal.isOpen && <Modal isOpen={openRolesModal.isOpen} title="اعضا گروه" body={<Roles roles={roles} onAction={handleGroupMembersAction} omit={me.permissions.includes("/groups.delete")} selectRole={me.permissions.includes("/groups.new")} />} onCloseModal={() => setOpenRolesModal({ isOpen: false, refGroup: "" })} />}
      {isOpenTransferModal && <Modal isOpen={isOpenTransferModal} title="انتقال به" body={<GroupTree groups={groups} isTransfer={true} onTransfer={handleTransferTo} />} onCloseModal={() => setIsOpenTransferModal(false)} />}
    </>
  )
}