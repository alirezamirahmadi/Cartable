import { PersonType } from "./personType";

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