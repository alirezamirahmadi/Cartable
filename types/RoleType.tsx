import { PersonType } from "./personType"

type RoleType = {
  _id?: string,
  title: string,
  refPerson: string,
  person?: PersonType,
  root: string | null,
  isActive: boolean,
}

export type {
  RoleType
}