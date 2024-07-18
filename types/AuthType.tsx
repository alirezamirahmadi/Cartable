import { PersonType } from "./personType";
import { RoleType } from "./roleType";

type LoginType = {
  username: string,
  password: string,
}

type MeType = {
  isLogin: boolean,
  _id: string,
  firstName: string,
  lastName: string,
  selectedRole: { _id: string, title: string, root: string },
  roles: [{ _id: string, title: string, root: string }],
}

export type {
  LoginType,
  MeType
}