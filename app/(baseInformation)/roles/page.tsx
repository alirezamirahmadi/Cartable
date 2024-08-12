"use client"

import { useEffect, useState } from "react";

import RoleModify from "@/components/role/roleModify";
import RoleTree from "@/components/role/roleTree";
import { RoleType } from "@/types/RoleType";
import Loading from "@/components/general/loading/loading";
import Snack from "@/components/general/snack/snack";
import type { SnackProps } from "@/types/generalType";

export default function RolesPage(): React.JSX.Element {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRolesUpdate, setIsRolesUpdate] = useState<boolean>(false);
  const [root, setRoot] = useState<string | null>(null);
  const [role, setRole] = useState<RoleType | undefined>({ _id: "", title: "", refPerson: "", root: null, isDefault: false, isActive: false });
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  useEffect(() => {
    isRolesUpdate && setIsRolesUpdate(false);
  }, [isRolesUpdate])

  useEffect(() => {
    setIsLoading(false);
  }, [role])

  const handleSelectRole = (selectedRole: RoleType | undefined) => {
    setIsLoading(true);
    setRoot(selectedRole?._id ?? null);
    setRole(selectedRole);
  }

  const handleModify = (isModify: boolean) => {
    if (isModify) {
      setIsRolesUpdate(true);
      setSnackProps({ context: "سمت مورد نظر با موفقیت ویرایش گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        <RoleTree onSelectRole={handleSelectRole} isUpdate={isRolesUpdate} />
        {!isLoading ? <RoleModify root={root} role={role} onModify={handleModify} /> : <Loading />}
        <Snack {...snackProps} />
      </div>
    </>
  )
}