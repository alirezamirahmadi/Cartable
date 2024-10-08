import { PersonType } from "./personType"

type RoleType = {
  _id: string | null,
  title: string,
  refPerson: string,
  person?: PersonType,
  root: string | null,
  isDefault: boolean,
  isActive: boolean,
  permissions?: string[],
}

export type {
  RoleType
}