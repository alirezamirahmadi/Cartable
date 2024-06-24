import { PersonType } from "./PersonType";

type LoginType = {
  username: string,
  password: string,
}

type MeType = {
  isLogin: boolean,
  firstName: string,
  lastName: string,
  refRole?: string[],
}

export type {
  LoginType,
  MeType
}