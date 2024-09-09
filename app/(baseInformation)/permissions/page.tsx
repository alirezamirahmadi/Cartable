import { Box } from "@mui/material";
import { cookies } from "next/headers"
import { JwtPayload } from "jsonwebtoken";

import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import permissionModel from "@/models/permission";
import roleModel from "@/models/role";
import groupModel from "@/models/group";
import connectToDB from "@/utils/db";
import { verifyToken } from "@/utils/token";
import type { RoleGroupType } from "@/types/generalType";
import type { RoleType } from "@/types/roleType";
import type { GroupType } from "@/types/groupType";

async function loadPermissionData(tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!tokenPayload) {
    return [];
  }

  const permissions = await permissionModel.find();

  return JSON.parse(JSON.stringify(permissions));
}

async function loadRoleData(tempGroup: RoleGroupType[]) {
  const roles = await roleModel.aggregate()
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .match({ isActive: true })
    .project({ "title": 1, "root": 1, "isActive": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1, "person.image": 1 })
    .unwind("person")

  const tempRoles: RoleGroupType[] = [];
  roles.map((role: RoleType) => {
    tempRoles.push({ _id: role._id ?? "", kind: 1, title: `${role.person?.firstName} ${role.person?.lastName} [ ${role.title} ]` })
  })
  return ([...tempGroup, ...JSON.parse(JSON.stringify(tempRoles))])
}

async function loadGroupData() {
  const groups = await groupModel.find({ kind: 2 });
  const tempGroups: RoleGroupType[] = [];
  groups.map((group: GroupType) => {
    tempGroups.push({ _id: group._id ?? "", kind: 2, title: group.title })
  })

  return JSON.parse(JSON.stringify(tempGroups));
}

export default async function Permission() {

  const token = cookies().get("token")?.value;
  const tokenPayload = verifyToken(token ?? "");

  const rolesAndGroups = await loadRoleData(await loadGroupData());
  const permissions = await loadPermissionData(tokenPayload);

  return (
    <>
      <Box sx={{ marginX: 1, }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SelectRoleGroup rolesAndGroups={rolesAndGroups} />
        </Box>
        <Box sx={{ px: 1, mt: 1 }}>
          <PermissionTree permissions={permissions} />
        </Box>
      </Box>
    </>
  )
}