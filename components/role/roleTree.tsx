"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Box, IconButton, ListItem, ListItemText, ListItemButton, Breadcrumbs, Button, List, Checkbox } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import GroupIcon from "@mui/icons-material/Group";

import Loading from "../general/loading/loading";
const Modal = dynamic(() => import("../general/modal/modal"), {loading:() => <Loading />});
const Snack = dynamic(() => import("../general/snack/snack"), {loading:() => <Loading />});
const RoleModify = dynamic(() => import("./roleModify"));
import ModifyButtons from "../general/modifyButtons/modifyButtons";
import Groups from "../group/groups";
import TreeActions from "../general/treeActions/treeActions";
import { useAppSelector } from "@/lib/hooks";
import type { RoleType } from "@/types/roleType";
import type { SnackProps } from "@/types/generalType";
import type { GroupType } from "@/types/groupType";

export default function RoleTree({ roles, isTransfer, onTransfer }:
  { roles: RoleType[], isTransfer?: boolean, onTransfer?: (root: string) => void }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const router = useRouter();
  const [roots, setRoots] = useState<RoleType[]>([{ _id: null, title: "خانه", root: null, refPerson: "", isDefault: false, isActive: true }]);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [isOpenNewModal, setIsOpenNewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenTransferModal, setIsOpenTransferModal] = useState<boolean>(false);
  const [isOpenMemberGroupsModal, setIsOpenMemberGroupsModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const [rolesList, setRolesList] = useState<RoleType[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [memberGroups, setMemberGroups] = useState<GroupType[]>([]);

  const loadRolesList = (searchContent?: string) => {
    setRolesList([...roles].filter((role: RoleType) => !searchContent ? role.root === roots[roots.length - 1]._id : role.title.includes(searchContent ?? "")))
  }

  useMemo(() => {
    loadRolesList();
  }, [roots, roles])

  const loadMemberGroups = async () => {
    selectedRole && await fetch(`api/v1/groupMembers?refRole=${selectedRole?._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setMemberGroups(data));
  }

  const handleBreadcrumbs = (root: RoleType) => {
    setSelectedRole(undefined);

    const tempRoots: RoleType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);

    setRoots(tempRoots);
  }

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
  }

  const handleSubRole = (role: RoleType) => {
    setSelectedRole(undefined);

    setRoots([...roots, role]);
  }

  const handleTransfer = () => {
    isTransfer && onTransfer ? onTransfer(checked.length === 1 ? checked[0] : "") : setIsOpenTransferModal(true);
  }

  const handleTransferTo = async (root: string) => {
    setIsOpenTransferModal(false);

    if (checked.includes(root)) {
      setSnackProps({ context: "سمت مقصد نمی تواند از سمت های انتخاب شده جهت انتقال باشد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }

    await fetch("api/v1/roles", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ roleIds: checked, root })
    })
      .then(res => {
        if (res.status === 201) {
          router.refresh();
          setChecked([]);
        }
      })
  }

  const handleToggle = (roleId: string) => {
    const index = checked.indexOf(roleId);

    if (!isTransfer) {
      const tempChecked = [...checked];
      index === -1 ? tempChecked.push(roleId) : tempChecked.splice(index, 1);
      setChecked([...tempChecked]);
    }
    else {
      setChecked(index === -1 ? [roleId] : []);
    }
  }

  const handleMemberGroups = () => {
    loadMemberGroups().then(() => setIsOpenMemberGroupsModal(true));
  }

  const handleMemberGroupsAction = (group: GroupType, action: string) => {
    switch (action) {
      case "SelectGroup":
        addMemberGroup(group._id ?? "");
        break;
      case "Delete":
        deleteMemberGroup(group._id ?? "");
        break;
    }
  }

  const addMemberGroup = async (refGroup: string) => {
    selectedRole && await fetch(`api/v1/groupMembers`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ refGroup, refRole: selectedRole._id })
    })
      .then(res => { res.status === 201 && loadMemberGroups() });
  }

  const deleteMemberGroup = async (refGroup: string) => {
    selectedRole && await fetch(`api/v1/groupMembers?refGroup=${refGroup}&refRole=${selectedRole._id}`, {
      method: "DELETE"
    })
      .then(res => { res.status === 200 && loadMemberGroups() });
  }

  const handleModifyRoleAction = (data: any, action: string) => {
    switch (action) {
      case "Add":
        setIsOpenNewModal(true);
        break;
      case "Edit":
        setIsOpenEditModal(true);
        break;
      case "Delete":
        deleteRole();
        break;
    }
  }

  const handleNewRole = (isModify: boolean) => {
    if (isModify) {
      setIsOpenNewModal(false);
      router.refresh();
      setSnackProps({ context: "سمت مورد نظر با موفقیت ایجاد گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  const handleEditRole = (isModify: boolean) => {
    if (isModify) {
      setIsOpenEditModal(false);
      router.refresh();
      setSnackProps({ context: "سمت مورد نظر با موفقیت ویرایش گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  const deleteRole = async () => {
    await fetch(`api/v1/roles/${selectedRole?._id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status === 200) {
          router.refresh();
          setSelectedRole(undefined);
          setSnackProps({ context: "سمت مورد نظر با موفقیت حذف گردید.", isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
        }
      })
      .catch(() => {
        setSnackProps({ context: "عملیات حذف با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  const handleTreeAction = (root: any[], action: string, searchContent: string | undefined) => {
    switch (action) {
      case "Search":
        loadRolesList(searchContent);
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
      <Box sx={{ minHeight: 352, width: "100%", maxWidth: 356, minWidth: 250, mx: 2, mb: 2, py: 2 }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: RoleType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.title}</Button>
          ))}
        </Breadcrumbs>

        <Box sx={{ display: "flex" }}>
          {me.permissions.includes("/roles.edit") &&
            <IconButton onClick={handleTransfer} disabled={checked.length === 0} title={isTransfer ? "انتقال به" : "انتقال"}>
              {isTransfer ? <MoveDownIcon /> : <MoveUpIcon />}
            </IconButton>
          }
          <IconButton onClick={handleMemberGroups} disabled={selectedRole ? false : true} title="گروه های عضو">
            <GroupIcon />
          </IconButton>
          <ModifyButtons add={me.permissions.includes("/roles.new")} edit={selectedRole && me.permissions.includes("/roles.edit") ? true : false} omit={selectedRole && me.permissions.includes("/roles.delete") ? true : false} onAction={handleModifyRoleAction} omitMessage={`آیا از حذف سمت ${selectedRole?.title} مطمئن هستید؟`} />
        </Box>
        <List>
          <ListItem component="div" disablePadding sx={{ px: 1, pb: 1 }}>
            <TreeActions roots={roots} search reset backward onAction={handleTreeAction} />
          </ListItem>
          {
            rolesList.map(role => (
              <ListItem key={role._id} sx={{ py: 0, minHeight: 24 }}>
                <Checkbox value={checked.includes(role._id ?? "")} onChange={() => handleToggle(role._id ?? "")} />
                <IconButton onClick={() => handleSubRole(role)}>
                  <PersonIcon />
                </IconButton>
                <ListItemButton sx={{ py: 0 }} selected={selectedRole?._id === role._id} onClick={(event) => handleSelectRole(role)}>
                  <ListItemText primary={role.title} />
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>

        {snackProps.isOpen && <Snack {...snackProps} />}
        {isOpenNewModal && <Modal title="سمت جدید" isOpen={isOpenNewModal} onCloseModal={() => setIsOpenNewModal(false)} body={<RoleModify root={roots[roots.length - 1]._id ?? null} onModify={handleNewRole} />} />}
        {isOpenEditModal && <Modal title="ویرایش سمت" isOpen={isOpenEditModal} onCloseModal={() => setIsOpenEditModal(false)} body={<RoleModify role={selectedRole} root={roots[roots.length - 1]._id ?? null} onModify={handleEditRole} />} />}
        {isOpenTransferModal && <Modal title="انتقال به" isOpen={isOpenTransferModal} onCloseModal={() => setIsOpenTransferModal(false)} body={<RoleTree roles={roles} isTransfer={true} onTransfer={handleTransferTo} />} />}
        {isOpenMemberGroupsModal && <Modal title="گروه های عضو" isOpen={isOpenMemberGroupsModal} onCloseModal={() => setIsOpenMemberGroupsModal(false)} body={<Groups groups={memberGroups} selectGroup={me.permissions.includes("/roles.new")} omit={me.permissions.includes("/roles.delete")} onAction={handleMemberGroupsAction} />} />}
      </Box>
    </>
  )
}