"use server";

import { JwtPayload } from "jsonwebtoken";

import connectToDB from "@/utils/db";
import personModel from "@/models/person";
import { MeType } from "@/types/authType";

async function getMe(tokenPayload: string | JwtPayload) {
  connectToDB();

  const meEmpty: MeType = { isLogin: false, _id: "", firstName: "", lastName: "", defaultRole: { _id: "", title: "", root: "" }, permissions: [], avatar: "" };
  if (!tokenPayload) {
    return meEmpty;
  }

  if (typeof tokenPayload !== "string") {
    const person = await personModel.aggregate()
      .match({ "account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "defaultRole" })
      .unwind("defaultRole")
      .match({ "defaultRole.isActive": true })
      .match({ "defaultRole.isDefault": true })
      .lookup({ from: "permissions", localField: "defaultRole.permissions", foreignField: "_id", as: "rolepermissions" })
      .lookup({ from: "groupmembers", localField: "defaultRole._id", foreignField: "refRole", as: "groupmember" })
      .lookup({ from: "groups", localField: "groupmember.refGroup", foreignField: "_id", as: "groups" })
      .lookup({ from: "permissions", localField: "groups.permissions", foreignField: "_id", as: "grouppermissions" })
      .project({
        "firstName": 1, "lastName": 1, "avatar": 1, "defaultRole._id": 1, "defaultRole.root": 1, "defaultRole.title": 1,
        "rolepermissions": 1, "grouppermissions": 1
      })
      .addFields({ "permissions": [] })
      .limit(1);

    const rolePermissions = new Set();
    if (person[0].grouppermissions) {
      person[0].grouppermissions?.map((permission: any) => rolePermissions.add(permission.title))
      person[0].grouppermissions = null;
    }
    if (person[0].rolepermissions) {
      person[0].rolepermissions.map((permission: any) => rolePermissions.add(permission.title))
      person[0].rolepermissions = null;
    }
    person[0].permissions = Array.from(rolePermissions);

    return person
      ?
      JSON.parse(JSON.stringify(person[0]))
      :
      meEmpty;
  }
}

async function checkPermission(title: string, username: string) {
  connectToDB();

  if (!username) {
    return false;
  }

  const permissionInRole = await personModel.aggregate()
    .match({ "account.username": username })
    .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
    .unwind("roles")
    .match({ "roles.isActive": true })
    .match({ "roles.isDefault": true })
    .lookup({ from: "permissions", localField: "roles.permissions", foreignField: "_id", as: "rolepermissions" })
    .match({ "rolepermissions.title": { $in: [title] } })
    .project({ "_id": 0, "rolepermissions.title": 1 })

  if (permissionInRole.length > 0) {
    return true;
  }

  const permissionInGroups = await personModel.aggregate()
    .match({ "account.username": username })
    .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
    .unwind("roles")
    .match({ "roles.isActive": true })
    .match({ "roles.isDefault": true })
    .lookup({ from: "groupmembers", localField: "roles._id", foreignField: "refRole", as: "groupmembers" })
    .lookup({ from: "groups", localField: "groupmembers.refGroup", foreignField: "_id", as: "groups" })
    .lookup({ from: "permissions", localField: "groups.permissions", foreignField: "_id", as: "grouppermissions" })
    .unwind("groups")
    .match({ "grouppermissions.title": { $in: [title] } })
    .project({ "_id": 0, "grouppermissions.title": 1 })

  if (permissionInGroups.length > 0) {
    return true;
  }

  return false;
}

export {
  getMe,
  checkPermission,
}