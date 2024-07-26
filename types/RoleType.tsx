import { PersonType } from "./personType"

type RoleType = {
  _id?: string,
  title: string,
  refPerson: string,
  person?: PersonType,
  root: string,
  isActive: boolean,
}

export type {
  RoleType
}